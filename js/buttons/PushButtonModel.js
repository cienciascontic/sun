// Copyright 2014-2017, University of Colorado Boulder

/**
 * Basic model for a push button, including over/down/enabled properties.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var ButtonModel = require( 'SUN/buttons/ButtonModel' );
  var CallbackTimer = require( 'SUN/CallbackTimer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var phetioEvents = require( 'ifphetio!PHET_IO/phetioEvents' );
  var sun = require( 'SUN/sun' );
  var Tandem = require( 'TANDEM/Tandem' );
  var TPushButtonModel = require( 'SUN/buttons/TPushButtonModel' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function PushButtonModel( options ) {

    options = _.extend( {

      fireOnDown: false, // true: fire on pointer down; false: fire on pointer up if pointer is over button
      listener: null, // {function} convenience for adding 1 listener, no args

      // fire-on-hold feature
      fireOnHold: false, // is the fire-on-hold feature enabled?
      fireOnHoldDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
      fireOnHoldInterval: 100, // fire continuously at this interval (milliseconds),
      tandem: Tandem.tandemOptional(),
      phetioState: false,
      phetioMethods: false
    }, options );

    var self = this;

    this.tandem = options.tandem;

    ButtonModel.call( this, options );

    // @public - used by a11y to disable utterances during reset, and sonification
    this.isFiringProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isFiringProperty' ),
      phetioState: options.phetioState,
      phetioMethods: options.phetioMethods
    } );

    this.listeners = []; // @private
    if ( options.listener !== null ) {
      this.listeners.push( options.listener );
    }

    // Create a timer to handle the optional fire-on-hold feature.
    // When that feature is enabled, calling this.fire is delegated to the timer.
    if ( options.fireOnHold ) {
      this.timer = new CallbackTimer( {
        callback: this.fire.bind( this ),
        delay: options.fireOnHoldDelay,
        interval: options.fireOnHoldInterval
      } );
    }

    // Point down
    this.downProperty.link( function( down ) {
      if ( down ) {
        if ( self.enabledProperty.get() ) {
          if ( options.fireOnDown ) {
            self.fire();
          }
          if ( self.timer ) {
            self.timer.start();
          }
        }
      }
      else {
        var fire = (!options.fireOnDown && self.overProperty.get() && self.enabledProperty.get()); // should the button fire?
        if ( self.timer ) {
          self.timer.stop( fire );
        }
        else if ( fire ) {
          self.fire();
        }
      }
    } );

    // Stop the timer when the button is disabled.
    this.enabledProperty.link( function( enabled ) {
      if ( !enabled && self.timer ) {
        self.timer.stop( false ); // Stop the timer, don't fire if we haven't already
      }
    } );

    this.disposePushButtonModel = function() {
      this.isFiringProperty.dispose();
      this.listeners.length = 0;
      if ( this.timer ) {
        this.timer.dispose();
        this.timer = null;
      }
    };
  }

  sun.register( 'PushButtonModel', PushButtonModel );

  return inherit( ButtonModel, PushButtonModel, {

    // @public
    dispose: function() {

      // If the button was firing, we must complete the PhET-iO transaction before disposing.
      // see https://github.com/phetsims/energy-skate-park-basics/issues/380
      this.isFiringProperty.value = false;
      this.disposePushButtonModel();
      ButtonModel.prototype.dispose.call( this );
    },

    /**
     * Adds a listener. If already a listener, this is a no-op.
     * @param {function} listener - function called when the button is pressed, no args
     * @public
     */
    addListener: function( listener ) {
      if ( this.listeners.indexOf( listener ) === -1 ) {
        this.listeners.push( listener );
      }
    },

    /**
     * Removes a listener. If not a listener, this is a no-op.
     * @param {function} listener
     * @public
     */
    removeListener: function( listener ) {
      var i = this.listeners.indexOf( listener );
      if ( i !== -1 ) {
        this.listeners.splice( i, 1 );
      }
    },

    /**
     * Fires all listeners.
     * @public (phet-io, a11y)
     */
    fire: function() {

      // Make sure the button is not already firing, see https://github.com/phetsims/energy-skate-park-basics/issues/380
      assert && assert( !this.isFiringProperty.value, 'Cannot fire when already firing' );
      this.isFiringProperty.value = true;
      var id = phetioEvents.start( 'user', this.tandem.id, TPushButtonModel, 'fired' );

      var copy = this.listeners.slice( 0 );
      copy.forEach( function( listener ) {
        listener();
      } );

      phetioEvents.end( id );
      this.isFiringProperty.value = false;
    }
  } );
} );