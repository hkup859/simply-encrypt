import { encrypt, decrypt, multiEncrypt, multiDecrypt, SUPPORTED_ALGORITHMS, Algorithm } from '../src/index'
const algorithmsToTest = Object.keys(SUPPORTED_ALGORITHMS).map(algorithm => ({ algorithm }))
const password = 'jKS21CSmYbwp9FyVsC*Gwn$LZncHrz@dzRFYw@p$eKG9H1svx^SGYvH57qx7'
const stringExample = 'This is the secret message'
const numberExample = 123
const simpleJsonExample = { data: 'String inside simple json' }

describe('Encrypt String', () => {
  test.each(algorithmsToTest)('Encrypt string with algorithm $algorithm', ({ algorithm }) => {
    const encryptedMessage = encrypt(Buffer.from(stringExample), password, algorithm as Algorithm)
    const decryptedMessage = decrypt(encryptedMessage, password, algorithm as Algorithm).toString('utf-8')
    expect(stringExample).toEqual(decryptedMessage)
  })
  test.each(algorithmsToTest)('Encrypt number with algorithm $algorithm', ({ algorithm }) => {
    const encryptedMessage = encrypt(Buffer.from(numberExample.toString()), password, algorithm as Algorithm)
    const decryptedMessage = decrypt(encryptedMessage, password, algorithm as Algorithm).toString('utf-8')
    expect(numberExample).toEqual(Number(decryptedMessage))
  })
  test.each(algorithmsToTest)('Encrypt simple json with algorithm $algorithm', ({ algorithm }) => {
    const encryptedMessage = encrypt(Buffer.from(JSON.stringify(simpleJsonExample)), password, algorithm as Algorithm)
    const decryptedMessage = decrypt(encryptedMessage, password, algorithm as Algorithm).toString('utf-8')
    expect(simpleJsonExample).toEqual(JSON.parse(decryptedMessage))
  })
})

describe('Multi Encrypt', () => {
  it('Encrypt String Buffer', () => {
    const encryptedMessage = multiEncrypt(Buffer.from(stringExample), password)
    const decryptedMessage = multiDecrypt(encryptedMessage, password).toString('utf-8')
    expect(stringExample).toEqual(decryptedMessage)
  })

  it('Encrypt Simple JSON Buffer', () => {
    const encryptedMessage = multiEncrypt(Buffer.from(JSON.stringify(simpleJsonExample)), password)
    const decryptedMessage = JSON.parse(multiDecrypt(encryptedMessage, password).toString('utf-8'))
    expect(simpleJsonExample).toEqual(decryptedMessage)
  })
  it('Encrypt Number Buffer', () => {
    const encryptedMessage = multiEncrypt(Buffer.from(numberExample.toString()), password)
    const decryptedMessage = multiDecrypt(encryptedMessage, password).toString('utf-8')
    expect(numberExample).toEqual(Number(decryptedMessage))
  })
})

// TODO - Tests to implement:
// Passing in IV for an algorithm.
// Passing in list of algorithms for multiEncrypt test
