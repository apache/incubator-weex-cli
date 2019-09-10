/* Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import * as http from 'http'
import * as https from 'https'
import * as url from 'url'

const protocols = {
  'http:': http,
  'https:': https,
}

export const getRemote = remoteUrl => {
  return new Promise(function(resolve, reject) {
    const urlObj = url.parse(remoteUrl)
    ;(protocols[urlObj.protocol] || protocols['http:'])
      .get(
        {
          hostname: urlObj.hostname,
          port: urlObj.port,
          path: urlObj.path,
          method: 'GET',
          headers: {
            'User-Agent': 'Weex/1.0.0',
          },
        },
        res => {
          let chunks = []
          res.on('data', function(chunk) {
            chunks.push(chunk)
          })
          res.on('end', function() {
            resolve(Buffer.concat(chunks).toString())
            chunks = null
          })
        },
      )
      .on('error', e => {
        reject(e)
      })
  })
}

export default {
  getRemote,
}
