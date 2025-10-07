"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "firebase-admin/app":
/*!*************************************!*\
  !*** external "firebase-admin/app" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("firebase-admin/app");

/***/ }),

/***/ "firebase-admin/auth":
/*!**************************************!*\
  !*** external "firebase-admin/auth" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("firebase-admin/auth");

/***/ }),

/***/ "firebase-admin/firestore":
/*!*******************************************!*\
  !*** external "firebase-admin/firestore" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("firebase-admin/firestore");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Canzin%5CStuvia%5CWEB%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Canzin%5CStuvia%5CWEB&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Canzin%5CStuvia%5CWEB%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Canzin%5CStuvia%5CWEB&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_anzin_Stuvia_WEB_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\anzin\\\\Stuvia\\\\WEB\\\\app\\\\api\\\\auth\\\\[...nextauth]\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_anzin_Stuvia_WEB_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNhbnppbiU1Q1N0dXZpYSU1Q1dFQiU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDYW56aW4lNUNTdHV2aWElNUNXRUImaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ3NCO0FBQ25HO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc3R1dmlhLz83ODIwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXGFuemluXFxcXFN0dXZpYVxcXFxXRUJcXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXFsuLi5uZXh0YXV0aF1cXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcYW56aW5cXFxcU3R1dmlhXFxcXFdFQlxcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcWy4uLm5leHRhdXRoXVxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Canzin%5CStuvia%5CWEB%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Canzin%5CStuvia%5CWEB&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/[...nextauth]/route.ts":
/*!*********************************************!*\
  !*** ./app/api/auth/[...nextauth]/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* reexport safe */ _lib_auth__WEBPACK_IMPORTED_MODULE_0__.GET),\n/* harmony export */   POST: () => (/* reexport safe */ _lib_auth__WEBPACK_IMPORTED_MODULE_0__.POST)\n/* harmony export */ });\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBdUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdHV2aWEvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cz9jOGE0Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB7IEdFVCwgUE9TVCB9IGZyb20gXCJAL2xpYi9hdXRoXCI7XG4iXSwibmFtZXMiOlsiR0VUIiwiUE9TVCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler),\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var next_auth_providers_google__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/providers/google */ \"(rsc)/./node_modules/next-auth/providers/google.js\");\n/* harmony import */ var _lib_userStoreFirebase__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/userStoreFirebase */ \"(rsc)/./lib/userStoreFirebase.ts\");\n/* harmony import */ var _lib_firebase_admin__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/lib/firebase/admin */ \"(rsc)/./lib/firebase/admin.ts\");\n\n\n\n\n\nconst authOptions = {\n    session: {\n        strategy: \"jwt\"\n    },\n    debug: \"development\" !== \"production\",\n    logger: {\n        error (code, metadata) {\n            console.error(\"[NextAuth][error]\", code, metadata);\n        },\n        warn (code) {\n            console.warn(\"[NextAuth][warn]\", code);\n        },\n        debug (code, metadata) {\n            console.debug(\"[NextAuth][debug]\", code, metadata);\n        }\n    },\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"Credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) return null;\n                // Restrict by domain for credentials as well\n                const allowedDomain = \"@rajagiri.edu.in\";\n                if (!credentials.email.toLowerCase().endsWith(allowedDomain)) {\n                    // Return null so NextAuth returns a JSON CredentialsSignin error\n                    return null;\n                }\n                // Authenticate against Firebase Auth REST API\n                try {\n                    const apiKey = \"AIzaSyCYXqrcoJx9NonJ6jHUmVmdzlNV16I8KQI\";\n                    if (!apiKey) {\n                        console.error(\"Missing NEXT_PUBLIC_FIREBASE_API_KEY for Firebase Auth\");\n                        return null;\n                    }\n                    const resp = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {\n                        method: \"POST\",\n                        headers: {\n                            \"Content-Type\": \"application/json\"\n                        },\n                        body: JSON.stringify({\n                            email: credentials.email,\n                            password: credentials.password,\n                            returnSecureToken: true\n                        })\n                    });\n                    if (!resp.ok) {\n                        // Parse firebase error for logs and return null\n                        try {\n                            const errJson = await resp.json();\n                            console.warn(\"Firebase Auth error:\", errJson);\n                        } catch  {}\n                        return null;\n                    }\n                    const data = await resp.json();\n                    // data contains idToken, localId, email, displayName, etc.\n                    return {\n                        id: data.localId,\n                        name: data.displayName || undefined,\n                        email: data.email\n                    };\n                } catch (e) {\n                    console.error(\"Firebase sign-in error\", e);\n                    return null;\n                }\n            }\n        }),\n        (0,next_auth_providers_google__WEBPACK_IMPORTED_MODULE_2__[\"default\"])({\n            clientId: process.env.GOOGLE_CLIENT_ID,\n            clientSecret: process.env.GOOGLE_CLIENT_SECRET\n        })\n    ],\n    pages: {\n        signIn: \"/login\"\n    },\n    callbacks: {\n        async signIn ({ user, account, profile }) {\n            // Enforce college domain for all providers\n            const allowedDomain = \"@rajagiri.edu.in\";\n            const email = (user?.email || \"\").toLowerCase();\n            if (!email.endsWith(allowedDomain)) {\n                return false; // AccessDenied\n            }\n            return true;\n        },\n        async jwt ({ token, user }) {\n            // On first sign-in, ensure a user profile exists and read completion flag\n            if (user?.email) {\n                try {\n                    const existing = await (0,_lib_userStoreFirebase__WEBPACK_IMPORTED_MODULE_3__.getByEmail)(user.email);\n                    if (!existing) {\n                        await (0,_lib_userStoreFirebase__WEBPACK_IMPORTED_MODULE_3__.upsertProfile)({\n                            email: user.email,\n                            name: user.name || undefined\n                        });\n                    }\n                    const refreshed = await (0,_lib_userStoreFirebase__WEBPACK_IMPORTED_MODULE_3__.getByEmail)(user.email);\n                    token.profileCompleted = refreshed?.profileCompleted ?? false;\n                    // Sync role from profile if present\n                    const profileRole = refreshed?.role;\n                    if (profileRole) {\n                        token.role = profileRole;\n                    }\n                } catch (e) {\n                    console.warn(\"[auth.jwt] profile read/upsert failed\", e);\n                    token.profileCompleted = false;\n                }\n                // ADMIN_EMAILS support: comma-separated list\n                try {\n                    const adminList = (process.env.ADMIN_EMAILS || \"\").toLowerCase().split(/[ ,]+/).filter(Boolean);\n                    const isAdminByEmail = adminList.includes(user.email.toLowerCase());\n                    if (isAdminByEmail) {\n                        token.role = \"admin\";\n                    }\n                } catch  {}\n                // Fallback if role still unset\n                token.role = token.role || user?.role || \"user\";\n                // Also annotate whether the Firebase user has password provider linked\n                try {\n                    const record = await _lib_firebase_admin__WEBPACK_IMPORTED_MODULE_4__.adminAuth.getUserByEmail(user.email);\n                    const hasPassword = record.providerData?.some((p)=>p.providerId === \"password\") || false;\n                    token.hasPasswordProvider = hasPassword;\n                } catch (e) {\n                    console.warn(\"[auth.jwt] adminAuth.getUserByEmail failed\", e);\n                    token.hasPasswordProvider = false;\n                }\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            session.user.role = token.role || \"user\";\n            session.user.profileCompleted = token.profileCompleted ?? false;\n            session.user.hasPasswordProvider = token.hasPasswordProvider ?? false;\n            return session;\n        }\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()(authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Z0JBQ3ZFLElBQUk7b0JBQ0YsTUFBTVEsU0FBUyxNQUFNbkUsMERBQVNBLENBQUNvRSxjQUFjLENBQUNsQixLQUFLbkMsS0FBSztvQkFDeEQsTUFBTXNELGNBQWNGLE9BQU9HLFlBQVksRUFBRUMsS0FBS0MsQ0FBQUEsSUFBS0EsRUFBRUMsVUFBVSxLQUFLLGVBQWU7b0JBQ2xGbkIsTUFBY29CLG1CQUFtQixHQUFHTDtnQkFDdkMsRUFBRSxPQUFPM0IsR0FBRztvQkFDVmhDLFFBQVFDLElBQUksQ0FBQyw4Q0FBOEMrQjtvQkFDMURZLE1BQWNvQixtQkFBbUIsR0FBRztnQkFDdkM7WUFDRjtZQUNBLE9BQU9wQjtRQUNUO1FBQ0EsTUFBTXBELFNBQVEsRUFBRUEsT0FBTyxFQUFFb0QsS0FBSyxFQUFFO1lBQzdCcEQsUUFBZ0JnRCxJQUFJLENBQUNTLElBQUksR0FBRyxNQUFlQSxJQUFJLElBQUk7WUFDbkR6RCxRQUFnQmdELElBQUksQ0FBQ08sZ0JBQWdCLEdBQUcsTUFBZUEsZ0JBQWdCLElBQUk7WUFDM0V2RCxRQUFnQmdELElBQUksQ0FBQ3dCLG1CQUFtQixHQUFHLE1BQWVBLG1CQUFtQixJQUFJO1lBQ2xGLE9BQU94RTtRQUNUO0lBQ0Y7SUFDQXlFLFFBQVF0RSxRQUFRbUIsR0FBRyxDQUFDb0QsZUFBZTtBQUNyQyxFQUFFO0FBRUYsTUFBTUMsVUFBVWxGLGdEQUFRQSxDQUFDTTtBQUNrQiIsInNvdXJjZXMiOlsid2VicGFjazovL3N0dXZpYS8uL2xpYi9hdXRoLnRzP2JmN2UiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE5leHRBdXRoLCB7IHR5cGUgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSBcIm5leHQtYXV0aFwiO1xuaW1wb3J0IENyZWRlbnRpYWxzIGZyb20gXCJuZXh0LWF1dGgvcHJvdmlkZXJzL2NyZWRlbnRpYWxzXCI7XG5pbXBvcnQgR29vZ2xlIGZyb20gXCJuZXh0LWF1dGgvcHJvdmlkZXJzL2dvb2dsZVwiO1xuaW1wb3J0IHsgZ2V0QnlFbWFpbCwgdXBzZXJ0UHJvZmlsZSB9IGZyb20gXCJAL2xpYi91c2VyU3RvcmVGaXJlYmFzZVwiO1xuaW1wb3J0IHsgYWRtaW5BdXRoIH0gZnJvbSBcIkAvbGliL2ZpcmViYXNlL2FkbWluXCI7XG5cbmV4cG9ydCBjb25zdCBhdXRoT3B0aW9uczogTmV4dEF1dGhPcHRpb25zID0ge1xuICBzZXNzaW9uOiB7IHN0cmF0ZWd5OiBcImp3dFwiIH0sXG4gIGRlYnVnOiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIsXG4gIGxvZ2dlcjoge1xuICAgIGVycm9yKGNvZGUsIG1ldGFkYXRhKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiW05leHRBdXRoXVtlcnJvcl1cIiwgY29kZSwgbWV0YWRhdGEpO1xuICAgIH0sXG4gICAgd2Fybihjb2RlKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJbTmV4dEF1dGhdW3dhcm5dXCIsIGNvZGUpO1xuICAgIH0sXG4gICAgZGVidWcoY29kZSwgbWV0YWRhdGEpIHtcbiAgICAgIGNvbnNvbGUuZGVidWcoXCJbTmV4dEF1dGhdW2RlYnVnXVwiLCBjb2RlLCBtZXRhZGF0YSk7XG4gICAgfSxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgQ3JlZGVudGlhbHMoe1xuICAgICAgbmFtZTogXCJDcmVkZW50aWFsc1wiLFxuICAgICAgY3JlZGVudGlhbHM6IHtcbiAgICAgICAgZW1haWw6IHsgbGFiZWw6IFwiRW1haWxcIiwgdHlwZTogXCJlbWFpbFwiIH0sXG4gICAgICAgIHBhc3N3b3JkOiB7IGxhYmVsOiBcIlBhc3N3b3JkXCIsIHR5cGU6IFwicGFzc3dvcmRcIiB9LFxuICAgICAgfSxcbiAgICAgIGFzeW5jIGF1dGhvcml6ZShjcmVkZW50aWFscykge1xuICAgICAgICBpZiAoIWNyZWRlbnRpYWxzPy5lbWFpbCB8fCAhY3JlZGVudGlhbHM/LnBhc3N3b3JkKSByZXR1cm4gbnVsbDtcbiAgICAgICAgLy8gUmVzdHJpY3QgYnkgZG9tYWluIGZvciBjcmVkZW50aWFscyBhcyB3ZWxsXG4gICAgICAgIGNvbnN0IGFsbG93ZWREb21haW4gPSBcIkByYWphZ2lyaS5lZHUuaW5cIjtcbiAgICAgICAgaWYgKCFjcmVkZW50aWFscy5lbWFpbC50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKGFsbG93ZWREb21haW4pKSB7XG4gICAgICAgICAgLy8gUmV0dXJuIG51bGwgc28gTmV4dEF1dGggcmV0dXJucyBhIEpTT04gQ3JlZGVudGlhbHNTaWduaW4gZXJyb3JcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvLyBBdXRoZW50aWNhdGUgYWdhaW5zdCBGaXJlYmFzZSBBdXRoIFJFU1QgQVBJXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgYXBpS2V5ID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfRklSRUJBU0VfQVBJX0tFWTtcbiAgICAgICAgICBpZiAoIWFwaUtleSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk1pc3NpbmcgTkVYVF9QVUJMSUNfRklSRUJBU0VfQVBJX0tFWSBmb3IgRmlyZWJhc2UgQXV0aFwiKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgZmV0Y2goXG4gICAgICAgICAgICBgaHR0cHM6Ly9pZGVudGl0eXRvb2xraXQuZ29vZ2xlYXBpcy5jb20vdjEvYWNjb3VudHM6c2lnbkluV2l0aFBhc3N3b3JkP2tleT0ke2FwaUtleX1gLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICBlbWFpbDogY3JlZGVudGlhbHMuZW1haWwsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IGNyZWRlbnRpYWxzLnBhc3N3b3JkLFxuICAgICAgICAgICAgICAgIHJldHVyblNlY3VyZVRva2VuOiB0cnVlLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICghcmVzcC5vaykge1xuICAgICAgICAgICAgLy8gUGFyc2UgZmlyZWJhc2UgZXJyb3IgZm9yIGxvZ3MgYW5kIHJldHVybiBudWxsXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCBlcnJKc29uID0gYXdhaXQgcmVzcC5qc29uKCk7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkZpcmViYXNlIEF1dGggZXJyb3I6XCIsIGVyckpzb24pO1xuICAgICAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwLmpzb24oKTtcbiAgICAgICAgICAvLyBkYXRhIGNvbnRhaW5zIGlkVG9rZW4sIGxvY2FsSWQsIGVtYWlsLCBkaXNwbGF5TmFtZSwgZXRjLlxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogZGF0YS5sb2NhbElkLFxuICAgICAgICAgICAgbmFtZTogZGF0YS5kaXNwbGF5TmFtZSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICBlbWFpbDogZGF0YS5lbWFpbCxcbiAgICAgICAgICB9IGFzIGFueTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGaXJlYmFzZSBzaWduLWluIGVycm9yXCIsIGUpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pLFxuICAgIEdvb2dsZSh7XG4gICAgICBjbGllbnRJZDogcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9JRCEsXG4gICAgICBjbGllbnRTZWNyZXQ6IHByb2Nlc3MuZW52LkdPT0dMRV9DTElFTlRfU0VDUkVUISxcbiAgICB9KSxcbiAgXSxcbiAgcGFnZXM6IHtcbiAgICBzaWduSW46IFwiL2xvZ2luXCIsXG4gIH0sXG4gIGNhbGxiYWNrczoge1xuICAgIGFzeW5jIHNpZ25Jbih7IHVzZXIsIGFjY291bnQsIHByb2ZpbGUgfSkge1xuICAgICAgLy8gRW5mb3JjZSBjb2xsZWdlIGRvbWFpbiBmb3IgYWxsIHByb3ZpZGVyc1xuICAgICAgY29uc3QgYWxsb3dlZERvbWFpbiA9IFwiQHJhamFnaXJpLmVkdS5pblwiO1xuICAgICAgY29uc3QgZW1haWwgPSAodXNlcj8uZW1haWwgfHwgXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmICghZW1haWwuZW5kc1dpdGgoYWxsb3dlZERvbWFpbikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBBY2Nlc3NEZW5pZWRcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgYXN5bmMgand0KHsgdG9rZW4sIHVzZXIgfSkge1xuICAgICAgLy8gT24gZmlyc3Qgc2lnbi1pbiwgZW5zdXJlIGEgdXNlciBwcm9maWxlIGV4aXN0cyBhbmQgcmVhZCBjb21wbGV0aW9uIGZsYWdcbiAgICAgIGlmICh1c2VyPy5lbWFpbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgZ2V0QnlFbWFpbCh1c2VyLmVtYWlsKTtcbiAgICAgICAgICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgICAgICAgICBhd2FpdCB1cHNlcnRQcm9maWxlKHsgZW1haWw6IHVzZXIuZW1haWwsIG5hbWU6IHVzZXIubmFtZSB8fCB1bmRlZmluZWQgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHJlZnJlc2hlZCA9IGF3YWl0IGdldEJ5RW1haWwodXNlci5lbWFpbCk7XG4gICAgICAgICAgKHRva2VuIGFzIGFueSkucHJvZmlsZUNvbXBsZXRlZCA9IHJlZnJlc2hlZD8ucHJvZmlsZUNvbXBsZXRlZCA/PyBmYWxzZTtcbiAgICAgICAgICAvLyBTeW5jIHJvbGUgZnJvbSBwcm9maWxlIGlmIHByZXNlbnRcbiAgICAgICAgICBjb25zdCBwcm9maWxlUm9sZSA9IChyZWZyZXNoZWQgYXMgYW55KT8ucm9sZSBhcyBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgICAgICAgaWYgKHByb2ZpbGVSb2xlKSB7XG4gICAgICAgICAgICAodG9rZW4gYXMgYW55KS5yb2xlID0gcHJvZmlsZVJvbGU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiW2F1dGguand0XSBwcm9maWxlIHJlYWQvdXBzZXJ0IGZhaWxlZFwiLCBlKTtcbiAgICAgICAgICAodG9rZW4gYXMgYW55KS5wcm9maWxlQ29tcGxldGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQURNSU5fRU1BSUxTIHN1cHBvcnQ6IGNvbW1hLXNlcGFyYXRlZCBsaXN0XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgYWRtaW5MaXN0ID0gKHByb2Nlc3MuZW52LkFETUlOX0VNQUlMUyB8fCBcIlwiKS50b0xvd2VyQ2FzZSgpLnNwbGl0KC9bICxdKy8pLmZpbHRlcihCb29sZWFuKTtcbiAgICAgICAgICBjb25zdCBpc0FkbWluQnlFbWFpbCA9IGFkbWluTGlzdC5pbmNsdWRlcyh1c2VyLmVtYWlsLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgIGlmIChpc0FkbWluQnlFbWFpbCkge1xuICAgICAgICAgICAgKHRva2VuIGFzIGFueSkucm9sZSA9IFwiYWRtaW5cIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2gge31cbiAgICAgICAgLy8gRmFsbGJhY2sgaWYgcm9sZSBzdGlsbCB1bnNldFxuICAgICAgICAodG9rZW4gYXMgYW55KS5yb2xlID0gKHRva2VuIGFzIGFueSkucm9sZSB8fCAodXNlciBhcyBhbnkpPy5yb2xlIHx8IFwidXNlclwiO1xuICAgICAgICAvLyBBbHNvIGFubm90YXRlIHdoZXRoZXIgdGhlIEZpcmViYXNlIHVzZXIgaGFzIHBhc3N3b3JkIHByb3ZpZGVyIGxpbmtlZFxuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IGFkbWluQXV0aC5nZXRVc2VyQnlFbWFpbCh1c2VyLmVtYWlsKTtcbiAgICAgICAgICBjb25zdCBoYXNQYXNzd29yZCA9IHJlY29yZC5wcm92aWRlckRhdGE/LnNvbWUocCA9PiBwLnByb3ZpZGVySWQgPT09ICdwYXNzd29yZCcpIHx8IGZhbHNlO1xuICAgICAgICAgICh0b2tlbiBhcyBhbnkpLmhhc1Bhc3N3b3JkUHJvdmlkZXIgPSBoYXNQYXNzd29yZDtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIlthdXRoLmp3dF0gYWRtaW5BdXRoLmdldFVzZXJCeUVtYWlsIGZhaWxlZFwiLCBlKTtcbiAgICAgICAgICAodG9rZW4gYXMgYW55KS5oYXNQYXNzd29yZFByb3ZpZGVyID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9LFxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9KSB7XG4gICAgICAoc2Vzc2lvbiBhcyBhbnkpLnVzZXIucm9sZSA9ICh0b2tlbiBhcyBhbnkpLnJvbGUgfHwgXCJ1c2VyXCI7XG4gICAgICAoc2Vzc2lvbiBhcyBhbnkpLnVzZXIucHJvZmlsZUNvbXBsZXRlZCA9ICh0b2tlbiBhcyBhbnkpLnByb2ZpbGVDb21wbGV0ZWQgPz8gZmFsc2U7XG4gICAgICAoc2Vzc2lvbiBhcyBhbnkpLnVzZXIuaGFzUGFzc3dvcmRQcm92aWRlciA9ICh0b2tlbiBhcyBhbnkpLmhhc1Bhc3N3b3JkUHJvdmlkZXIgPz8gZmFsc2U7XG4gICAgICByZXR1cm4gc2Vzc2lvbjtcbiAgICB9LFxuICB9LFxuICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCxcbn07XG5cbmNvbnN0IGhhbmRsZXIgPSBOZXh0QXV0aChhdXRoT3B0aW9ucyk7XG5leHBvcnQgeyBoYW5kbGVyIGFzIEdFVCwgaGFuZGxlciBhcyBQT1NUIH07XG5cbiJdLCJuYW1lcyI6WyJOZXh0QXV0aCIsIkNyZWRlbnRpYWxzIiwiR29vZ2xlIiwiZ2V0QnlFbWFpbCIsInVwc2VydFByb2ZpbGUiLCJhZG1pbkF1dGgiLCJhdXRoT3B0aW9ucyIsInNlc3Npb24iLCJzdHJhdGVneSIsImRlYnVnIiwicHJvY2VzcyIsImxvZ2dlciIsImVycm9yIiwiY29kZSIsIm1ldGFkYXRhIiwiY29uc29sZSIsIndhcm4iLCJwcm92aWRlcnMiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJlbWFpbCIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwiYWxsb3dlZERvbWFpbiIsInRvTG93ZXJDYXNlIiwiZW5kc1dpdGgiLCJhcGlLZXkiLCJlbnYiLCJORVhUX1BVQkxJQ19GSVJFQkFTRV9BUElfS0VZIiwicmVzcCIsImZldGNoIiwibWV0aG9kIiwiaGVhZGVycyIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwicmV0dXJuU2VjdXJlVG9rZW4iLCJvayIsImVyckpzb24iLCJqc29uIiwiZGF0YSIsImlkIiwibG9jYWxJZCIsImRpc3BsYXlOYW1lIiwidW5kZWZpbmVkIiwiZSIsImNsaWVudElkIiwiR09PR0xFX0NMSUVOVF9JRCIsImNsaWVudFNlY3JldCIsIkdPT0dMRV9DTElFTlRfU0VDUkVUIiwicGFnZXMiLCJzaWduSW4iLCJjYWxsYmFja3MiLCJ1c2VyIiwiYWNjb3VudCIsInByb2ZpbGUiLCJqd3QiLCJ0b2tlbiIsImV4aXN0aW5nIiwicmVmcmVzaGVkIiwicHJvZmlsZUNvbXBsZXRlZCIsInByb2ZpbGVSb2xlIiwicm9sZSIsImFkbWluTGlzdCIsIkFETUlOX0VNQUlMUyIsInNwbGl0IiwiZmlsdGVyIiwiQm9vbGVhbiIsImlzQWRtaW5CeUVtYWlsIiwiaW5jbHVkZXMiLCJyZWNvcmQiLCJnZXRVc2VyQnlFbWFpbCIsImhhc1Bhc3N3b3JkIiwicHJvdmlkZXJEYXRhIiwic29tZSIsInAiLCJwcm92aWRlcklkIiwiaGFzUGFzc3dvcmRQcm92aWRlciIsInNlY3JldCIsIk5FWFRBVVRIX1NFQ1JFVCIsImhhbmRsZXIiLCJHRVQiLCJQT1NUIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/firebase/admin.ts":
/*!*******************************!*\
  !*** ./lib/firebase/admin.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   adminAuth: () => (/* binding */ adminAuth),\n/* harmony export */   db: () => (/* binding */ db)\n/* harmony export */ });\n/* harmony import */ var firebase_admin_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-admin/app */ \"firebase-admin/app\");\n/* harmony import */ var firebase_admin_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_admin_app__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_admin_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-admin/auth */ \"firebase-admin/auth\");\n/* harmony import */ var firebase_admin_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_admin_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase-admin/firestore */ \"firebase-admin/firestore\");\n/* harmony import */ var firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst projectId = process.env.FIREBASE_PROJECT_ID;\nconst clientEmail = process.env.FIREBASE_CLIENT_EMAIL;\nlet privateKey = process.env.FIREBASE_PRIVATE_KEY;\n// Support escaped newlines\nif (privateKey && privateKey.includes(\"\\\\n\")) {\n    privateKey = privateKey.replace(/\\\\n/g, \"\\n\");\n}\nif (!(0,firebase_admin_app__WEBPACK_IMPORTED_MODULE_0__.getApps)().length) {\n    if (clientEmail && privateKey && projectId) {\n        (0,firebase_admin_app__WEBPACK_IMPORTED_MODULE_0__.initializeApp)({\n            credential: (0,firebase_admin_app__WEBPACK_IMPORTED_MODULE_0__.cert)({\n                projectId,\n                clientEmail,\n                privateKey\n            })\n        });\n    } else {\n        // Fallback to application default credentials if available (e.g., on GCP)\n        (0,firebase_admin_app__WEBPACK_IMPORTED_MODULE_0__.initializeApp)({\n            credential: (0,firebase_admin_app__WEBPACK_IMPORTED_MODULE_0__.applicationDefault)()\n        });\n    }\n}\nconst adminAuth = (0,firebase_admin_auth__WEBPACK_IMPORTED_MODULE_1__.getAuth)();\nconst db = (0,firebase_admin_firestore__WEBPACK_IMPORTED_MODULE_2__.getFirestore)();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZmlyZWJhc2UvYWRtaW4udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBc0Y7QUFDeEM7QUFDVTtBQUV4RCxNQUFNTSxZQUFZQyxRQUFRQyxHQUFHLENBQUNDLG1CQUFtQjtBQUNqRCxNQUFNQyxjQUFjSCxRQUFRQyxHQUFHLENBQUNHLHFCQUFxQjtBQUNyRCxJQUFJQyxhQUFhTCxRQUFRQyxHQUFHLENBQUNLLG9CQUFvQjtBQUVqRCwyQkFBMkI7QUFDM0IsSUFBSUQsY0FBY0EsV0FBV0UsUUFBUSxDQUFDLFFBQVE7SUFDNUNGLGFBQWFBLFdBQVdHLE9BQU8sQ0FBQyxRQUFRO0FBQzFDO0FBRUEsSUFBSSxDQUFDZiwyREFBT0EsR0FBR2dCLE1BQU0sRUFBRTtJQUNyQixJQUFJTixlQUFlRSxjQUFjTixXQUFXO1FBQzFDTCxpRUFBYUEsQ0FBQztZQUNaZ0IsWUFBWWYsd0RBQUlBLENBQUM7Z0JBQ2ZJO2dCQUNBSTtnQkFDQUU7WUFDRjtRQUNGO0lBQ0YsT0FBTztRQUNMLDBFQUEwRTtRQUMxRVgsaUVBQWFBLENBQUM7WUFBRWdCLFlBQVlkLHNFQUFrQkE7UUFBRztJQUNuRDtBQUNGO0FBRU8sTUFBTWUsWUFBWWQsNERBQU9BLEdBQUc7QUFDNUIsTUFBTWUsS0FBS2Qsc0VBQVlBLEdBQUciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdHV2aWEvLi9saWIvZmlyZWJhc2UvYWRtaW4udHM/MWYwNSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRBcHBzLCBpbml0aWFsaXplQXBwLCBjZXJ0LCBhcHBsaWNhdGlvbkRlZmF1bHQgfSBmcm9tIFwiZmlyZWJhc2UtYWRtaW4vYXBwXCI7XG5pbXBvcnQgeyBnZXRBdXRoIH0gZnJvbSBcImZpcmViYXNlLWFkbWluL2F1dGhcIjtcbmltcG9ydCB7IGdldEZpcmVzdG9yZSB9IGZyb20gXCJmaXJlYmFzZS1hZG1pbi9maXJlc3RvcmVcIjtcblxuY29uc3QgcHJvamVjdElkID0gcHJvY2Vzcy5lbnYuRklSRUJBU0VfUFJPSkVDVF9JRDtcbmNvbnN0IGNsaWVudEVtYWlsID0gcHJvY2Vzcy5lbnYuRklSRUJBU0VfQ0xJRU5UX0VNQUlMO1xubGV0IHByaXZhdGVLZXkgPSBwcm9jZXNzLmVudi5GSVJFQkFTRV9QUklWQVRFX0tFWTtcblxuLy8gU3VwcG9ydCBlc2NhcGVkIG5ld2xpbmVzXG5pZiAocHJpdmF0ZUtleSAmJiBwcml2YXRlS2V5LmluY2x1ZGVzKFwiXFxcXG5cIikpIHtcbiAgcHJpdmF0ZUtleSA9IHByaXZhdGVLZXkucmVwbGFjZSgvXFxcXG4vZywgXCJcXG5cIik7XG59XG5cbmlmICghZ2V0QXBwcygpLmxlbmd0aCkge1xuICBpZiAoY2xpZW50RW1haWwgJiYgcHJpdmF0ZUtleSAmJiBwcm9qZWN0SWQpIHtcbiAgICBpbml0aWFsaXplQXBwKHtcbiAgICAgIGNyZWRlbnRpYWw6IGNlcnQoe1xuICAgICAgICBwcm9qZWN0SWQsXG4gICAgICAgIGNsaWVudEVtYWlsLFxuICAgICAgICBwcml2YXRlS2V5LFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2sgdG8gYXBwbGljYXRpb24gZGVmYXVsdCBjcmVkZW50aWFscyBpZiBhdmFpbGFibGUgKGUuZy4sIG9uIEdDUClcbiAgICBpbml0aWFsaXplQXBwKHsgY3JlZGVudGlhbDogYXBwbGljYXRpb25EZWZhdWx0KCkgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGFkbWluQXV0aCA9IGdldEF1dGgoKTtcbmV4cG9ydCBjb25zdCBkYiA9IGdldEZpcmVzdG9yZSgpO1xuIl0sIm5hbWVzIjpbImdldEFwcHMiLCJpbml0aWFsaXplQXBwIiwiY2VydCIsImFwcGxpY2F0aW9uRGVmYXVsdCIsImdldEF1dGgiLCJnZXRGaXJlc3RvcmUiLCJwcm9qZWN0SWQiLCJwcm9jZXNzIiwiZW52IiwiRklSRUJBU0VfUFJPSkVDVF9JRCIsImNsaWVudEVtYWlsIiwiRklSRUJBU0VfQ0xJRU5UX0VNQUlMIiwicHJpdmF0ZUtleSIsIkZJUkVCQVNFX1BSSVZBVEVfS0VZIiwiaW5jbHVkZXMiLCJyZXBsYWNlIiwibGVuZ3RoIiwiY3JlZGVudGlhbCIsImFkbWluQXV0aCIsImRiIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/firebase/admin.ts\n");

/***/ }),

/***/ "(rsc)/./lib/userStoreFirebase.ts":
/*!**********************************!*\
  !*** ./lib/userStoreFirebase.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getByEmail: () => (/* binding */ getByEmail),\n/* harmony export */   upsertProfile: () => (/* binding */ upsertProfile)\n/* harmony export */ });\n/* harmony import */ var _lib_firebase_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/firebase/admin */ \"(rsc)/./lib/firebase/admin.ts\");\n\nconst USERS_COLL = \"users\";\nasync function getByEmail(email) {\n    const doc = await _lib_firebase_admin__WEBPACK_IMPORTED_MODULE_0__.db.collection(USERS_COLL).doc(email.toLowerCase()).get();\n    if (!doc.exists) return null;\n    return doc.data();\n}\nasync function upsertProfile(profile) {\n    const emailKey = profile.email.toLowerCase();\n    // Determine profileCompleted based on provided fields\n    const profileCompleted = Boolean(profile.name && profile.branch && profile.division && profile.semester);\n    const existing = await getByEmail(profile.email);\n    const merged = {\n        ...existing || {\n            email: profile.email\n        },\n        ...profile,\n        profileCompleted\n    };\n    await _lib_firebase_admin__WEBPACK_IMPORTED_MODULE_0__.db.collection(USERS_COLL).doc(emailKey).set(merged, {\n        merge: true\n    });\n    return merged;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvdXNlclN0b3JlRmlyZWJhc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTBDO0FBVzFDLE1BQU1DLGFBQWE7QUFFWixlQUFlQyxXQUFXQyxLQUFhO0lBQzVDLE1BQU1DLE1BQU0sTUFBTUosbURBQUVBLENBQUNLLFVBQVUsQ0FBQ0osWUFBWUcsR0FBRyxDQUFDRCxNQUFNRyxXQUFXLElBQUlDLEdBQUc7SUFDeEUsSUFBSSxDQUFDSCxJQUFJSSxNQUFNLEVBQUUsT0FBTztJQUN4QixPQUFPSixJQUFJSyxJQUFJO0FBQ2pCO0FBRU8sZUFBZUMsY0FBY0MsT0FBb0I7SUFDdEQsTUFBTUMsV0FBV0QsUUFBUVIsS0FBSyxDQUFDRyxXQUFXO0lBQzFDLHNEQUFzRDtJQUN0RCxNQUFNTyxtQkFBbUJDLFFBQ3ZCSCxRQUFRSSxJQUFJLElBQUlKLFFBQVFLLE1BQU0sSUFBSUwsUUFBUU0sUUFBUSxJQUFJTixRQUFRTyxRQUFRO0lBRXhFLE1BQU1DLFdBQVcsTUFBTWpCLFdBQVdTLFFBQVFSLEtBQUs7SUFDL0MsTUFBTWlCLFNBQXNCO1FBQzFCLEdBQUlELFlBQVk7WUFBRWhCLE9BQU9RLFFBQVFSLEtBQUs7UUFBQyxDQUFDO1FBQ3hDLEdBQUdRLE9BQU87UUFDVkU7SUFDRjtJQUNBLE1BQU1iLG1EQUFFQSxDQUFDSyxVQUFVLENBQUNKLFlBQVlHLEdBQUcsQ0FBQ1EsVUFBVVMsR0FBRyxDQUFDRCxRQUFRO1FBQUVFLE9BQU87SUFBSztJQUN4RSxPQUFPRjtBQUNUIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc3R1dmlhLy4vbGliL3VzZXJTdG9yZUZpcmViYXNlLnRzPzNhZmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGIgfSBmcm9tIFwiQC9saWIvZmlyZWJhc2UvYWRtaW5cIjtcblxuZXhwb3J0IHR5cGUgVXNlclByb2ZpbGUgPSB7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGJyYW5jaD86IHN0cmluZztcbiAgZGl2aXNpb24/OiBzdHJpbmc7XG4gIHNlbWVzdGVyPzogc3RyaW5nO1xuICBwcm9maWxlQ29tcGxldGVkPzogYm9vbGVhbjtcbn07XG5cbmNvbnN0IFVTRVJTX0NPTEwgPSBcInVzZXJzXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRCeUVtYWlsKGVtYWlsOiBzdHJpbmcpOiBQcm9taXNlPFVzZXJQcm9maWxlIHwgbnVsbD4ge1xuICBjb25zdCBkb2MgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKFVTRVJTX0NPTEwpLmRvYyhlbWFpbC50b0xvd2VyQ2FzZSgpKS5nZXQoKTtcbiAgaWYgKCFkb2MuZXhpc3RzKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIGRvYy5kYXRhKCkgYXMgVXNlclByb2ZpbGU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cHNlcnRQcm9maWxlKHByb2ZpbGU6IFVzZXJQcm9maWxlKTogUHJvbWlzZTxVc2VyUHJvZmlsZT4ge1xuICBjb25zdCBlbWFpbEtleSA9IHByb2ZpbGUuZW1haWwudG9Mb3dlckNhc2UoKTtcbiAgLy8gRGV0ZXJtaW5lIHByb2ZpbGVDb21wbGV0ZWQgYmFzZWQgb24gcHJvdmlkZWQgZmllbGRzXG4gIGNvbnN0IHByb2ZpbGVDb21wbGV0ZWQgPSBCb29sZWFuKFxuICAgIHByb2ZpbGUubmFtZSAmJiBwcm9maWxlLmJyYW5jaCAmJiBwcm9maWxlLmRpdmlzaW9uICYmIHByb2ZpbGUuc2VtZXN0ZXJcbiAgKTtcbiAgY29uc3QgZXhpc3RpbmcgPSBhd2FpdCBnZXRCeUVtYWlsKHByb2ZpbGUuZW1haWwpO1xuICBjb25zdCBtZXJnZWQ6IFVzZXJQcm9maWxlID0ge1xuICAgIC4uLihleGlzdGluZyB8fCB7IGVtYWlsOiBwcm9maWxlLmVtYWlsIH0pLFxuICAgIC4uLnByb2ZpbGUsXG4gICAgcHJvZmlsZUNvbXBsZXRlZCxcbiAgfTtcbiAgYXdhaXQgZGIuY29sbGVjdGlvbihVU0VSU19DT0xMKS5kb2MoZW1haWxLZXkpLnNldChtZXJnZWQsIHsgbWVyZ2U6IHRydWUgfSk7XG4gIHJldHVybiBtZXJnZWQ7XG59XG4iXSwibmFtZXMiOlsiZGIiLCJVU0VSU19DT0xMIiwiZ2V0QnlFbWFpbCIsImVtYWlsIiwiZG9jIiwiY29sbGVjdGlvbiIsInRvTG93ZXJDYXNlIiwiZ2V0IiwiZXhpc3RzIiwiZGF0YSIsInVwc2VydFByb2ZpbGUiLCJwcm9maWxlIiwiZW1haWxLZXkiLCJwcm9maWxlQ29tcGxldGVkIiwiQm9vbGVhbiIsIm5hbWUiLCJicmFuY2giLCJkaXZpc2lvbiIsInNlbWVzdGVyIiwiZXhpc3RpbmciLCJtZXJnZWQiLCJzZXQiLCJtZXJnZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/userStoreFirebase.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/@opentelemetry","vendor-chunks/@babel","vendor-chunks/oauth","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/cookie","vendor-chunks/@panva","vendor-chunks/oidc-token-hash"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Canzin%5CStuvia%5CWEB%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Canzin%5CStuvia%5CWEB&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();