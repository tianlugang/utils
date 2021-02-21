import { spawn } from 'child_process'
import { logger } from '@tlg/util'

type IRepo = NonNullable<ReturnType<typeof normalize>>;
type IValidRepo = IRepo & { url: string }

type IOptions = {
  git?: string
  shallow?: boolean
  checkout?: string
  repoHost?: string
}

type IErrorFirstCallback<T = any> = {
  (err: NodeJS.ErrnoException | null, data?: T): void
}

const ERR_CODE = {
  BAD_SRC: 'Normalize git repo src fail.',
  BAD_URL: 'Invalid git-repo(URL).',
  CLONE_FAIL: 'Git clone failed.',
  CHECKOUT_FAIL: 'Git checkout Failed.',
}

function createError(code: string, message: string) {
  const err: NodeJS.ErrnoException = new Error(message)

  err.code = code
  return err
}

// git clone
function clone(src: string, dest: string, opts: IOptions = {}, callback: IErrorFirstCallback) {
  const repo = getRepo(src, opts.repoHost, true)

  if (repo instanceof Error) {
    return callback(repo);
  }

  const url = repo.url;
  const args = ['clone'];
  opts.checkout = repo.checkout || opts.checkout;
  opts.shallow = opts.checkout === 'master';

  if (opts.shallow) {
    args.push('--depth', '1');
  }

  args.push('--', url, dest);
  logger.debug(repo, 'type:@{type} origin:@{origin} owner:@{owner} name:@{name} checkout:@{checkout}');
  logger.debug({ url, origin: repo.origin }, 'git clone `@{url}` from @{origin}.');

  spawn(opts.git || 'git', args).on('close', function (status) {
    if (status == 0) {
      if (opts.checkout) {
        checkout(opts, dest, callback);
      } else {
        callback(null);
      }
    } else {
      callback(createError(ERR_CODE.CLONE_FAIL, "'git clone' failed with status " + status));
    }
  });
}

// git checkout
function checkout(opts: IOptions, dest: string, callback: IErrorFirstCallback) {
  const args = ['checkout', opts.checkout || 'master'];
  const childProcess = spawn(opts.git || 'git', args, { cwd: dest });

  childProcess.on('close', function (status) {
    if (status == 0) {
      callback(null);
    } else {
      callback(createError(ERR_CODE.CHECKOUT_FAIL, "'git checkout' failed with status " + status));
    }
  });
}

// 标准化 repo 地址.
function normalize(repo: string, repoHost?: string) {
  let regex = /^(?:(direct):([^#]+)(?:#(.+))?)$/;
  let match = regex.exec(repo);
  if (match) {
    const url = match[2];
    const directCheckout = match[3] || 'master';

    return {
      type: 'direct',
      url: url,
      checkout: directCheckout
    };
  }

  regex = /^(?:(github|gitlab|bitbucket):)?(?:(.+):)?([^/]+)\/([^#]+)(?:#(.+))?$/;
  match = regex.exec(repo);

  if (match) {
    let type = match[1] || 'github';
    let origin = match[2] || repoHost;
    let owner = match[3];
    let name = match[4];
    let checkout = match[5] || 'master';

    if (origin == null) {
      if (type === 'github') {
        origin = 'github.com';
      } else if (type === 'gitlab') {
        origin = 'gitlab.com';
      } else if (type === 'bitbucket') {
        origin = 'bitbucket.org';
      }
    }

    return {
      type,
      origin,
      owner,
      name: /\.git$/.test(name) ? name.replace(/\.git$/g, '') : name,
      checkout: checkout
    };
  }

  return;
}

// 添加协议到 git origin 上
function addProtocol(origin: string, cloned: boolean) {
  if (/^(ftp|http):\/\//i.test(origin)) {
    return origin
  }

  if (/^(ftp(s)?)|(http(s)?):\/\//i.test(origin)) {
    return origin
  }

  if (/^git@/i.test(origin)) {
    return origin
  }

  return (cloned ? 'git@' : 'https://') + origin
}

// 获取一个 有效的 git 仓库地址 zip 或 .git 的url
function formatURL(repo: IRepo, cloned: boolean) {
  if (!repo.origin) {
    return
  }

  let origin = addProtocol(repo.origin, cloned)

  if (/^git@/i.test(origin)) {
    origin = origin + ':'
  } else {
    origin = origin + '/'
  }

  if (cloned) {
    return origin + repo.owner + '/' + repo.name + '.git'
  }

  switch (repo.type) {
    case 'github':
      return origin + repo.owner + '/' + repo.name + '/archive/' + repo.checkout + '.zip'
    case 'private':
    case 'gitlab':
      return origin + repo.owner + '/' + repo.name + '/repository/archive.zip?ref=' + repo.checkout
    case 'bitbucket':
      return origin + repo.owner + '/' + repo.name + '/get/' + repo.checkout + '.zip'
    default:
      return origin + repo.owner + '/' + repo.name + '.git'
  }
}

function getRepo(src: string, repoHost?: string, cloned: boolean = false): IValidRepo | NodeJS.ErrnoException {
  const repo = normalize(src, repoHost);

  try {
    if (!repo) {
      throw createError(ERR_CODE.BAD_SRC, 'Normalize fail `src`: ' + src)
    }

    var url = repo.url || formatURL(repo, cloned);

    if (!url) {
      throw createError(ERR_CODE.BAD_URL, 'Invalid git(URL)');
    }

    return Object.assign(repo, { url })
  } catch (error) {
    return error;
  }
}

function isEasyError(err: NodeJS.ErrnoException) {
  if (err instanceof Error) {
    switch (err.code) {
      case ERR_CODE.BAD_SRC:
      case ERR_CODE.BAD_URL:
        return true
      default: return false
    }
  }

  return false
}

export default {
  clone,
  checkout,
  getRepo,
  isEasyError
}
