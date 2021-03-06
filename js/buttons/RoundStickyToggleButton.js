// Copyright 2014-2017, University of Colorado Boulder

/**
 * A round toggle button that switches the value of a property that can take on valueUp or valueDown.  It
 * sticks in the down position when pressed, popping back up when pressed
 * again.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var RoundButtonView = require( 'SUN/buttons/RoundButtonView' );
  var StickyToggleButtonInteractionStateProperty = require( 'SUN/buttons/StickyToggleButtonInteractionStateProperty' );
  var StickyToggleButtonModel = require( 'SUN/buttons/StickyToggleButtonModel' );
  var sun = require( 'SUN/sun' );
  var Tandem = require( 'TANDEM/Tandem' );
  var TToggleButton = require( 'SUN/buttons/TToggleButton' );

  /**
   * @param {Object} valueUp value when the toggle is in the 'up' position
   * @param {Object} valueDown value when the toggle is in the 'down' position
   * @param {Property} property axon property that can be either valueUp or valueDown.
   * @param {Object} [options]
   * @constructor
   */
  function RoundStickyToggleButton( valueUp, valueDown, property, options ) {

    var self = this;

    options = _.extend( {
      tandem: Tandem.tandemRequired(),
      phetioType: TToggleButton,

      // a11y
      tagName: 'input',
      inputType: 'button'
    }, options );

    // @public (phet-io)
    this.toggleButtonModel = new StickyToggleButtonModel( valueUp, valueDown, property, options );
    this.phetioValueType = property.phetioValueType;
    RoundButtonView.call( this, this.toggleButtonModel, new StickyToggleButtonInteractionStateProperty( this.toggleButtonModel ), options );

    // @private (a11y) - toggle the button when we receive the accessible click event
    this.accessibleClickListener = this.addAccessibleInputListener( {
      click: function( event ) {
        self.toggleButtonModel.toggle();
      }
    } );
  }

  sun.register( 'RoundStickyToggleButton', RoundStickyToggleButton );

  return inherit( RoundButtonView, RoundStickyToggleButton, {
    dispose: function() {
      this.removeAccessibleInputListener( this.accessibleClickListener );
      this.toggleButtonModel.dispose(); //TODO this fails with assertions enabled, see sun#212
      RoundButtonView.prototype.dispose.call( this );
    }
  } );
} );