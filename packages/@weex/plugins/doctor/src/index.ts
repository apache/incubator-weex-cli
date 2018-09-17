import { Doctor } from './doctor'

export default function(): Promise<any> {
  return new Promise((resolve, reject) => {
    const doctor = new Doctor();
    resolve(doctor)
  })
}
