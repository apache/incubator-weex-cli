/*
 * Weex Toolkit Network utils
 */

const os  = require('os')
const _   = require("underscore")

export function getPublicIP(){
    let publicIP = "127.0.0.1"  //fallbck ip
	let ifaces = os.networkInterfaces()
	let address = _.flatten(_.values(ifaces))
	address = _.filter( address , (ifObj) =>  ( (ifObj.family == "IPv4") && (ifObj.address != "127.0.0.1") ) )
	if (address.length > 0 ){
	    publicIP = address[0].address
	}
    return publicIP
}
