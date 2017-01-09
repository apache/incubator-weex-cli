import foo from "{{$module}}";
foo.el = '#root';
export default new Vue(foo);
