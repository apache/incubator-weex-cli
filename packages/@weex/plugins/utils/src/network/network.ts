export function getIp (): Promise<any> {
	return new Promise((resolve) => {
		require('dns').lookup(require('os').hostname(), function(err: any, add: string) {
  		// Get first ipv4
			resolve(add)
		})
	})
}

export function detectPort (insertPort: number): Promise<any> {
	return new Promise((resolve) => {
		let checkPort = function(port: number) {
		let net = require('net')
		let tester = net.createServer()
			.once('error', function (err: any) {
				if (err.code === 'EADDRINUSE') {
					return checkPort(port + 1)
				}
				resolve(port)
			})
			.once('listening', function() {
				tester.once('close', function() {
					resolve(port)
				})
				.close()
			})
			.listen(port)
		}
		checkPort(insertPort)
	})
}