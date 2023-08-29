import crypto from 'crypto'
import { shuffle } from './utils'
import { SUPPORTED_ALGORITHMS, Algorithm } from './constants'
export { SUPPORTED_ALGORITHMS, Algorithm }
const INFO_KEY = 'JVctPYLJGKbp9kVLzacWCFh6HTc8qzxksAw4eN27UpgHbpwAuSdKxPN59xuG'
const IV = '4TVaUNiZIzXAe+CUVFHQHg=='

export const encrypt = (data: Buffer, password: string, algorithm: Algorithm = 'AES_GCM_256', iv?: Buffer): Buffer => {
  const algorithmDetails = SUPPORTED_ALGORITHMS[algorithm]
  const initVector = iv ?? crypto.randomBytes(algorithmDetails.ivLength)
  const generatedKey = crypto.scryptSync(password, initVector, algorithmDetails.keyLength)
  const cipher = crypto.createCipheriv(algorithmDetails.name as crypto.CipherGCMTypes, generatedKey, initVector, { authTagLength: algorithmDetails.authTagLength })
  const bufferDetails: Buffer[] = [initVector, cipher.update(data), cipher.final()]
  if (algorithmDetails.authTagLength !== 0) bufferDetails.unshift(cipher.getAuthTag())
  const encryptedData = Buffer.concat(bufferDetails)
  return encryptedData
}

export const decrypt = (encryptedData: Buffer, password: string, algorithm: Algorithm = 'AES_GCM_256'): Buffer => {
  const algorithmDetails = SUPPORTED_ALGORITHMS[algorithm]
  const authTag: Buffer = encryptedData.slice(0, algorithmDetails.authTagLength)
  const initVector: Buffer = encryptedData.slice(algorithmDetails.authTagLength, algorithmDetails.authTagLength + algorithmDetails.ivLength)
  const encryptedBuffer: Buffer = encryptedData.slice(algorithmDetails.authTagLength + algorithmDetails.ivLength)
  const generatedKey = crypto.scryptSync(password, initVector, algorithmDetails.keyLength)
  const decipher = crypto.createDecipheriv(algorithmDetails.name as crypto.CipherGCMTypes, generatedKey, initVector, { authTagLength: algorithmDetails.authTagLength })
  if (algorithmDetails.authTagLength !== 0) decipher.setAuthTag(authTag)
  const decryptedData = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()])

  return decryptedData
}

const ALGORITHM_LABELS = Object.keys(SUPPORTED_ALGORITHMS).map(algorithm => encrypt(Buffer.from(algorithm.padStart(30)), INFO_KEY, 'AES_CBC_256', Buffer.from(IV, 'base64')))

export const multiEncrypt = (data: Buffer, password: string, algorithms?: Algorithm[]): Buffer => {
  let dataInProgress: Buffer = data
  if (algorithms == null) {
    algorithms = shuffle(Object.keys(SUPPORTED_ALGORITHMS)) as Algorithm[]
  }
  algorithms.forEach((algorithm) => {
    const headerInfo = ALGORITHM_LABELS[Object.keys(SUPPORTED_ALGORITHMS).indexOf(algorithm)] ?? Buffer.from('')
    const partialData = encrypt(Buffer.from(dataInProgress), password, algorithm)
    dataInProgress = Buffer.concat([headerInfo, partialData])
  })
  return dataInProgress
}

export const multiDecrypt = (encryptedData: Buffer, password: string): Buffer => {
  let data = encryptedData
  for (let i = 0; i < 100; i++) { // Limit to 100 to stop any potential infinite loop scenario
    const encryptedHeaderInfo: Buffer = data.slice(0, 48)
    const encryptedBuffer: Buffer = data.slice(48)
    const algorithmIndex = ALGORITHM_LABELS.findIndex(algorithmLabel => Buffer.compare(encryptedHeaderInfo, algorithmLabel) === 0)
    if (algorithmIndex === -1) break
    const algorithm: Algorithm = Object.keys(SUPPORTED_ALGORITHMS)[algorithmIndex] as Algorithm
    data = decrypt(encryptedBuffer, password, algorithm)
  }

  return data
}
