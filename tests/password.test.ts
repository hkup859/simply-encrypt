import { encrypt, decrypt } from '../src/index'
const passwordsToTest: Array<{ password: string }> = [
  'snMzx@N4',
  '%%N3xxBYjfWt',
  '%AsK$JUFUnKYfN7t',
  'GSBeJ6rhBGH48zu4&9^H',
  'ZuLyUcj8Lk^$dy3e3fa6k5c8',
  '21$L#GW7eJ#tmaa%^!ugH1817C7%',
  'RFdzhh8%*MtFaybvH@xbNazMDshGaAf!',
  'qH1uE&*H7V#RmYtFP#!hCRQn3EzJNtEFsUKw',
  'uSJ3p^jYk&s98@8u@&K8S94Stes4d^FtMUyYpT6k',
  '%2uTSKr5y2VEm%@W9#Y6snSgyX6Ny%cfGhgjJSy3r*kH',
  'hG511Bgh7F38KALtLfp1q*94CkvSDZsHn3URJYgmWLeDnNCM',
  'cg3^8t4abFhrcZwFZ!j2zU#qMK6G5thHDytqe&gvhp%Lp@!x$nk#',
  'asaZ&ZTrQ8e@m2gTfv%5kbcS5G67d#*T76NtSqEH%TTwrNmphKYzZUfZ',
  'Ve2^bZCjvjgpQ$rPSYdnyX2aBM!KWg&2M$UJHpQXF7$gYRuteR7vP@LybkX%',
  '5FgvCYWdLw!yqf#$TXPdNRsenacE2^ymrpCE3!31^JYejATVu9XiBJMceZ88u0#o',
  'bCFKxJ&DCmPx*^Anh9q^HaaiLY8AV9VxjjELrakSeIXoxx^2Ci7wIWBexyzVGTVnKcJClVet9APrK&Ol6sg12ArzGZMc5%k%*GHA^X*mNqnPl*zdoih5FSW5zg7QH&iY',
  'coconuts destined unadjusted ketenes rend ogdoad malty parpen lemniscate gup',
  '`1234567890-=~!@#$%^&*()_+qwertyuiop[]QWERTYUIOP{}|asdfghjkl;ASDFGHJKL:"zxcvbnm,./ZXCVBNM<>? €'
].map(password => ({ password }))

describe('Encrypt With Various Passwords', () => {
  test.each(passwordsToTest)('Encrypt data with password $password', ({ password }) => {
    const secretMessage = 'This is TOP secret'
    const encryptedMessage = encrypt(Buffer.from(secretMessage), password, 'AES_GCM_256')
    const decryptedMessage = decrypt(encryptedMessage, password, 'AES_GCM_256').toString('utf-8')
    expect(secretMessage).toEqual(decryptedMessage)
  })
})
