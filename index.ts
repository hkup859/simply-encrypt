import crypto from 'crypto'
const INFO_KEY = 'JVctPYLJGKbp9kVLzacWCFh6HTc8qzxksAw4eN27UpgHbpwAuSdKxPN59xuG'
const IV = '4TVaUNiZIzXAe+CUVFHQHg=='
import { shuffle} from './utils'

export const SUPPORTED_ALGORITHMS = {
  AES_CBC_256: { name: 'aes-256-cbc', ivLength: 16, keyLength: 32 },
  AES_CBC_192: { name: 'aes-192-cbc', ivLength: 16, keyLength: 24 },
  AES_CBC_128: { name: 'aes-128-cbc', ivLength: 16, keyLength: 16 }
  // AES_256_GCM: 'aes-256-gcm'
  
} as const
export type Algorithm = keyof typeof SUPPORTED_ALGORITHMS

// TODO - work out the best way to handle buffer logic so any data type can be passed in.
export const encrypt = (data: Buffer, password: string, algorithm: Algorithm, iv?: Buffer) => {
  // TODO - const dataBuffer = Buffer.from(JSON.stringify({embeddedData: data}))
  const algorithmDetails = SUPPORTED_ALGORITHMS[algorithm]
  const initVector = iv || crypto.randomBytes(algorithmDetails.ivLength)
  const generatedKey = crypto.scryptSync(password, initVector, algorithmDetails.keyLength)
  const cipher = crypto.createCipheriv(algorithmDetails.name, generatedKey, initVector);
  const encryptedData = Buffer.concat([initVector, cipher.update(data), cipher.final()]);
  return encryptedData
}

export const decrypt = (encryptedData: Buffer, password: string, algorithm: Algorithm) => {
  const algorithmDetails = SUPPORTED_ALGORITHMS[algorithm]
  const initVector: Buffer = encryptedData.slice(0, algorithmDetails.ivLength)
  const encryptedBuffer: Buffer = encryptedData.slice(algorithmDetails.ivLength)
  const generatedKey = crypto.scryptSync(password, initVector, algorithmDetails.keyLength)
  const decipher = crypto.createDecipheriv(algorithmDetails.name, generatedKey, initVector);
  const decryptedData = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()])
  
  return decryptedData
}

const ALGORITHM_LABELS = Object.keys(SUPPORTED_ALGORITHMS).map(x => encrypt(Buffer.from(x.padStart(30)), INFO_KEY, 'AES_CBC_256', Buffer.from(IV, 'base64')))

export const multiEncrypt = (data: Buffer, password: string, algorithms?: Algorithm[]) => {
  let finalData: Buffer
  let dataInProgress: Buffer = data
  if (!algorithms) {
    // TS ERROR - error TS2322: Type 'string[]' is not assignable to type '("AES_CBC_256" | "AES_CBC_192" | "AES_CBC_128")[]'. Type 'string' is not assignable to type '"AES_CBC_256" | "AES_CBC_192" | "AES_CBC_128"'.
    algorithms = shuffle(Object.keys(SUPPORTED_ALGORITHMS))
  }
  // TS ERROR - error TS18048: 'algorithms' is possibly 'undefined'.
  // It doesn't realize that algorithms will always be defined at this point, consider using ts-reset?
  algorithms.forEach((algorithm) => {
    
    const headerInfo = ALGORITHM_LABELS[Object.keys(SUPPORTED_ALGORITHMS).indexOf(algorithm)]
    const partialData = encrypt(Buffer.from(dataInProgress), password, algorithm)
    dataInProgress = Buffer.concat([headerInfo, partialData])
  })
  return dataInProgress
}

export const multiDecrypt = (encryptedData: Buffer, password: string) => {
  let data = encryptedData
  for(let i = 0; i < 100; i++) { // Limit to 100 to stop any potential infinite loop scenario
    const encryptedHeaderInfo: Buffer = data.slice(0, 48)
    const encryptedBuffer: Buffer = data.slice(48)
    const algorithmIndex = ALGORITHM_LABELS.findIndex(x => Buffer.compare(encryptedHeaderInfo, x) === 0)
    if (algorithmIndex === -1) break
    // TS ERROR - error TS2322: Type 'string' is not assignable to type '"AES_CBC_256" | "AES_CBC_192" | "AES_CBC_128"'
    const algorithm: Algorithm = Object.keys(SUPPORTED_ALGORITHMS)[algorithmIndex]  
    data = decrypt(encryptedBuffer, password, algorithm)
  }
  
  return data
}