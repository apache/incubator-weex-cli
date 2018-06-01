/**
 * Defines additional properties added to global object from CLI.
 */
interface WXCliGlobal extends NodeJS.Global {
	/**
	 * Lodash instance.
	 */
	_: any;

	/**
	 * Global instance of the module used for dependency injection.
	 */
	$injector: any;
}
