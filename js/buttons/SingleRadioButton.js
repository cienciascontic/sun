// Copyright 2002-2014, University of Colorado Boulder

/**
 * A single radio button. This class is designed to be part of a RadioButtonGroup and there should be no need to use it
 * outside of RadioButtonGroup. It is called SingleRadioButton to differentiate from RadioButton, which alreaduy exists.
 *
 * @author Aaron Davis
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var RectangularButtonView = require( 'SUN/buttons/RectangularButtonView' );
  var StickyToggleButtonInteractionStateProperty = require( 'SUN/buttons/StickyToggleButtonInteractionStateProperty' );
  var RadioButtonModel = require( 'SUN/buttons/RadioButtonModel' );

  /**
   * @param {Object} value value when this radio button is selected
   * @param {Property} property axon property that can take on a set of values, one for each radio button in the
   * group
   * @param {Object} [options]
   * @constructor
   */
  function SingleRadioButton( value, property, options ) {
    var buttonModel = new RadioButtonModel( value, property );

    // keep a reference to this property to be used in RadioButtonGroup for managing the labels
    this.interactionStateProperty = new StickyToggleButtonInteractionStateProperty( buttonModel );
    RectangularButtonView.call( this, buttonModel, this.interactionStateProperty, options );
  }

  return inherit( RectangularButtonView, SingleRadioButton );
} );