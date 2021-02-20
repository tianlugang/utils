/*
   关于：
      比特(b)，字节(B)，千字节(KB)，兆字节(MB)，千兆字节(GB)，
      太字节(TB)，拍字节(PB)，艾字节(EB)，泽字节(ZB)，尧字节(YB)，
   等各种容量单位间的换算。
   
   换算率约等于1000（1024），从大到小顺序为T、GB、MB（兆Zhao）、KB、B再小就是位（比特）了。
   1TB=1024GB 1GB=1024MB 1MB=1024KB 1KB=1024B 1B=8b
   计算机存储单位一般用bit、B、KB、MB、GB、TB、PB、EB、ZB、YB、BB、NB、DB……来表示，它们之间的关系是：
   位 bit (比特)(Binary Digits)：存放一位二进制数，即 0 或 1，最小的存储单位。[英文缩写：b(固定小写)]
   字节byte：8个二进制位为一个字节(B)，最常用的单位。
   1 Byte（B） = 8 bit
   1 Kilo Byte（KB） = 1024B
   1 Mega Byte（MB） = 1024 KB
   1 Giga Byte （GB）= 1024 MB
   1 Tera Byte（TB）= 1024 GB
   1 Peta Byte（PB） = 1024 TB
   1 Exa Byte（EB） = 1024 PB
   1 Zetta Byte（ZB） = 1024 EB
   1 Yotta Byte（YB）= 1024 ZB
   1 Bronto Byte（BB） = 1024 YB
   1 Nona Byte（NB）= 1024 BB
   1 Dogga Byte（DB）= 1024 NB
   1 Corydon Byte（CB）= 1024DB
   
   注意上面Kibi这一系列的定义。
   Kibi来自英语kilo-binary(二进制的千)， 1998年10月在IEC60027-2中订位标准。
   但到目前在各种应用中还没有完全占优势。
   在信息行业中常用用于内存容量的MB、 GB，几乎都是指220，230，… 数位组。
   KB也经常表示210数位组，以区别于kB。当然你也会经常看到kB被混用来表示210数位组。这些表示法都并没有被标准化。

   至于硬盘容量，一般的制造商总是用十进制的计数。
   一般计算机的操作系统都是使用二进制的计数，
   所以你经常会发现在计算机看到的硬盘容量比硬盘上的实际可用容量要小，比如20GB的硬盘只显示有18.6GB。
   特别误导人是软盘的情况。
   720KB的软盘是720×1024个数位组的值经常用2个十六进制的数字（在信息科学中这样一个16进制的数字也称为一），
   而1.44MB的软盘则莫名奇妙的是1.44×1000×1024个数位组的值经常用两个十六进制的数字（在信息科学中这样一个16进制的数字也称为一），即不全是十进制也不全是二进制。
   注：“兆”为百万级数量单位。

   附：进制单位全称及译音
   yotta，[尧]它， Y. 10^24，
   zetta，[泽]它， Z. 10^21，
   exa，[艾]可萨， E. 10^18，
   peta，[拍]它，  P. 10^15，
   tera，[太]拉，  T. 10^12，
   giga，[吉]咖，  G. 10^9，
   mega，[兆]，    M. 10^6
*/
const suffix = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB", "BB", "NB", "DB", "CB"]

/**
 * 计算文件大小
 * @param {number} size 
 */
export function transformByte(size: number, fixed: number = 2) {

  for (let i = 0; i < suffix.length; i++) {
    const spec = Math.pow(1024, i)

    if (size < 1000 * spec) {
      return (size / spec).toFixed(fixed) + suffix[i]
    }
  }

  return size + suffix[0]
}
