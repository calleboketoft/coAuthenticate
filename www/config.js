System.config({
  "baseURL": "/",
  "defaultJSExtensions": true,
  "transpiler": "typescript",
  "paths": {
    "github:*": "jspm_packages/github/*"
  },
  "packages": {
    "app": {
      "defaultExtension": "ts"
    }
  }
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.4.2",
    "angular-ui-router": "github:angular-ui/ui-router@0.2.15",
    "typescript": "github:mhegazy/typescript@v1.5-beta2",
    "github:angular-ui/ui-router@0.2.15": {
      "angular": "github:angular/bower-angular@1.4.2"
    }
  }
});

