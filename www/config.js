System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "typescript",
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  packages: {
    "app": {
      "defaultExtension": "ts"
    }
  },

  map: {
    "angular": "github:angular/bower-angular@1.4.6",
    "angular-ui-router": "github:angular-ui/ui-router@0.2.15",
    "typescript": "npm:typescript@1.6.2",
    "github:angular-ui/ui-router@0.2.15": {
      "angular": "github:angular/bower-angular@1.4.6"
    }
  }
});
