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
import Vue from 'vue'
import VueRouter from 'vue-router'
import { Route } from 'vue-router'
interface Snotify {
  simple: any
  success: any
  info: any
  warning: any
  error: any
  async: any
  confirm: any
  prompt: any
  html: any
  setDefaults: any
  get: any
  remove: any
  clear: any
  create: any
}

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
// 扩充
declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
    $route: Route
    $snotify: Snotify
  }
}
