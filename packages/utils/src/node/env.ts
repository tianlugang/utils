const NODE_ENV = (process.env.NODE_ENV || 'development').trim()
const env = NODE_ENV
const isDev = NODE_ENV !== 'production'
const isTest = NODE_ENV === 'testing'
const isProd = !isDev

export const NODE_APP_ENVIRONMENT = {
    env,
    isDev,
    isProd,
    isTest
}
export default NODE_APP_ENVIRONMENT