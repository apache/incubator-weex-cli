import * as expect from 'expect'
import * as path from 'path'
import { contains } from 'ramda'
import { fs } from './fs-tools'

test('isFile', () => {
  expect(fs.isFile(__filename)).toBe(true)
  expect(fs.isFile(__dirname)).toBe(false)
})

test('isNotFile', () => {
  expect(fs.isNotFile(__filename)).toBe(false)
  expect(fs.isNotFile(__dirname)).toBe(true)
})

test('isDirectory', () => {
  expect(fs.isDirectory(__dirname)).toBe(true)
  expect(fs.isDirectory(__filename)).toBe(false)
})

test('isNotDirectory', () => {
  expect(fs.isNotDirectory(__dirname)).toBe(false)
  expect(fs.isNotDirectory(__filename)).toBe(true)
})

test('subdirectories', () => {
  const dirs = fs.subdirectories(`${__dirname}/..`)
  expect(dirs.length).toBe(8)
  expect(contains(`${__dirname}/../toolbox`, dirs)).toBe(true)
})

test('blank subdirectories', () => {
  expect(fs.subdirectories('')).toEqual([])
  expect(fs.subdirectories(__filename)).toEqual([])
})

test('relative subdirectories', () => {
  const dirs = fs.subdirectories(`${__dirname}/..`, true)
  expect(dirs.length).toBe(8)
  expect(contains(`toolbox`, dirs)).toBe(true)
})

test('filtered subdirectories', () => {
  const dirs = fs.subdirectories(`${__dirname}/..`, true, 'to*')
  expect(1).toBe(dirs.length)
  expect(contains(`toolbox`, dirs)).toBe(true)
})

test('isLocalPath', () => {
  const localPath = './test'
  const remotePath = 'https://github.com'
  expect(fs.isLocalPath(localPath)).toBe(true)
  expect(fs.isLocalPath(remotePath)).toBe(false)
})

test('getAbsolutePath', () => {
  const relativePath = './test'
  const absolutePath = '/User/username'
  expect(fs.getAbsolutePath(relativePath)).toBe(path.join(`${process.cwd()}`, relativePath))
  expect(fs.getAbsolutePath(absolutePath)).toBe(absolutePath)
})
