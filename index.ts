import crypto from 'crypto'

const SUPPORTED_ALGORITHMS = {
  AES_256_CBC: 'aes-256-cbc'
} as const

type ObjectValues<T> = T[keyof T]
export type Algorithm = ObjectValues<typeof SUPPORTED_ALGORITHMS>

// AES-256-CBC Encryption
export const encrypt = (buffer: Buffer, password: string, algorithm: Algorithm) => {
  const initVector = crypto.randomBytes(16)
  const generatedKey = crypto.scryptSync(password, initVector, 32)
  const cipher = crypto.createCipheriv(algorithm, generatedKey, initVector);
  const encryptedData = Buffer.concat([initVector, cipher.update(buffer), cipher.final()]);
  return encryptedData
}

// AES-256-CBC Decryption
export const decrypt = (encryptedData: Buffer, password: string, algorithm: Algorithm) => {
  const initVector: Buffer = encryptedData.slice(0, 16)
  const encryptedBuffer: Buffer = encryptedData.slice(16)
  const generatedKey = crypto.scryptSync(password, initVector, 32)
  const decipher = crypto.createDecipheriv(algorithm, generatedKey, initVector);
  const decryptedData = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()])
  return decryptedData
}
