var assert = require('assert')


describe('symbiont(1)', function() {
  describe('default usage', function() {
    let testPackage


    it('can create a instance of Symbiont class', function() {
      const Symbiont = require('../')
      testPackage = new Symbiont()

      assert.ok(testPackage instanceof Symbiont, 'sould be an instance of Symbiont module')
    })


    describe('should have the constant value', function() {
      it('should have `package.constructorNameString`', function() {
        assert.strictEqual(testPackage.constructorNameString, 'Symbiont', 'should be equal to `Symbiont`')
      })


      it('should have `package.versionSymbiontConstructor`', function() {
        const constructorVersion = testPackage.versionSymbiontConstructor
        const currentVersion = require('../package.json').version
        assert.strictEqual(constructorVersion, currentVersion, 'should be the current package version')
        assert.strictEqual(typeof constructorVersion, 'string', 'should be a string')
        assert.ok(/^\d+\.\d+\.\d+$/.test(constructorVersion), 'should respect the a.b.c format, exemple: `1.2.3`')
      })
    })


    describe('should have registerController function', function() {
      function HomeControllerInterface() {
      }
      HomeControllerInterface.prototype.home = () => '|_| <-- this is my home!'
      const homeController = new HomeControllerInterface()


      it('should register controller', function() {
        testPackage.registerController('home', homeController)
      })


      it('should not register twice controller with the same name', function() {
        const action = () => {
          testPackage.registerController('home', homeController)
        }

        assert.throws(action, /"home" controller was already registered\./)
      })


      it('should have two arguments & name sould be a string', function() {
        const action = () => {
          testPackage.registerController(homeController)
        }

        assert.throws(action, /First argument "name" of registerController should be a string\./)
      })


      it('should not register controller with function', function() {
        const action = () => {
          testPackage.registerController('home', () => 'a random text')
        }

        assert.throws(action, /Second argument "controller" of registerController should be an object, not a function\./)
      })


      it('should have an alias `on`', function() {
        assert.strictEqual(typeof testPackage.on, 'function', 'should be a function')
        assert.strictEqual(testPackage.on, testPackage.registerEventListener, 'should the same function')
      })
    })


    describe('should have registerEventListener function', function() {
      it('should register an event listener', function() {
        testPackage.registerEventListener('onRequest', () => 'request')
      })


      it('should register a second event listener', function() {
        testPackage.registerEventListener('onRequest', () => 'request2')
      })


      it('should have two arguments & name sould be a string', function() {
        const action = () => {
          testPackage.registerEventListener(() => 'bad')
        }

        assert.throws(action, /First argument "name" of registerEventListener should be a string\./)
      })


      it('should register event listener only with a function', function() {
        const action = () => {
          testPackage.registerEventListener('onRequest', {})
        }

        assert.throws(action, /Second argument "listener" of registerEventListener should be a function, not a object\./)
      })
    })


    describe('should have getPrivateStorage function', function() {
      it('should return an object with controllers and listeners items', function() {
        const storage = testPackage.getPrivateStorage()
        assert.strictEqual(typeof storage, 'object', 'should be an object')
        assert.strictEqual(typeof storage.controllers, 'object', 'should have controllers object')
        assert.strictEqual(typeof storage.listeners, 'object', 'should have listeners object')
      })


      it('should have a controller in this storage', function() {
        const storage = testPackage.getPrivateStorage()
        const homeController = storage.controllers['home']
        assert.strictEqual(typeof storage.listeners, 'object', 'should be an object')
        assert.strictEqual(homeController.constructor.name, 'HomeControllerInterface', 'should be homeControllerInterface')
        assert.strictEqual(homeController.home(), '|_| <-- this is my home!', 'should have a home function')
      })


      it('should have a listener in this storage', function() {
        const storage = testPackage.getPrivateStorage()
        const onRequestListeners = storage.listeners['onRequest']

        assert.ok(onRequestListeners instanceof Array, 'should be an array')
        assert.strictEqual(onRequestListeners[0](), 'request', 'should have functions')
        assert.strictEqual(onRequestListeners[1](), 'request2', 'should have 2nd function')
        assert.strictEqual(onRequestListeners.length, 2, 'should have two children')
      })
    })
  })
})

