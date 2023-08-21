import crypto from 'crypto'

export const SUPPORTED_ALGORITHMS = {
  AES_CBC_256: { name: 'aes-256-cbc', ivLength: 16, keyLength: 32 },
  AES_CBC_192: { name: 'aes-192-cbc', ivLength: 16, keyLength: 24 },
  AES_CBC_128: { name: 'aes-128-cbc', ivLength: 16, keyLength: 16 }
  // AES_256_GCM: 'aes-256-gcm'
} as const

// export type Algorithm = (typeof)[keyof typeof SUPPORTED_ALGORITHMS]
export type Algorithm = keyof typeof SUPPORTED_ALGORITHMS

// AES-256-CBC Encryption
export const encrypt = (buffer: Buffer, password: string, algorithm: Algorithm) => {
  const algorithmDetails = SUPPORTED_ALGORITHMS[algorithm]
  const initVector = crypto.randomBytes(algorithmDetails.ivLength)
  const generatedKey = crypto.scryptSync(password, initVector, algorithmDetails.keyLength)
  const cipher = crypto.createCipheriv(algorithmDetails.name, generatedKey, initVector);
  const encryptedData = Buffer.concat([initVector, cipher.update(buffer), cipher.final()]);
  return encryptedData
}

// AES-256-CBC Decryption
export const decrypt = (encryptedData: Buffer, password: string, algorithm: Algorithm) => {
  const algorithmDetails = SUPPORTED_ALGORITHMS[algorithm]
  const initVector: Buffer = encryptedData.slice(0, algorithmDetails.ivLength)
  const encryptedBuffer: Buffer = encryptedData.slice(algorithmDetails.ivLength)
  const generatedKey = crypto.scryptSync(password, initVector, algorithmDetails.keyLength)
  const decipher = crypto.createDecipheriv(algorithmDetails.name, generatedKey, initVector);
  const decryptedData = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()])
  return decryptedData
}
