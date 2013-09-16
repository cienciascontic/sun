// Copyright 2002-2013, University of Colorado Boulder

/**
 * Horizontal slider.
 * Optionally snaps to min when released.
 *
 * Moved from beers-law-lab/EvaporationSlider on 9/15/2013
 * see https://github.com/phetsims/sun/issues/9
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Dimension2 = require( 'DOT/Dimension2' );
  var FillHighlightListener = require( 'SCENERY_PHET/input/FillHighlightListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Property<Number>} valueProperty
   * @param {Range} range
   * @param {Property<Boolean>} enabledProperty
   * @param {*} options
   * @constructor
   */
  function HSlider( valueProperty, range, enabledProperty, options ) {

    var thisSlider = this;
    Node.call( thisSlider );

    // default options, these will not be passed to supertype
    var defaultOptions = {
      trackSize: new Dimension2( 100, 5 ),
      thumbSize: new Dimension2( 22, 45 ),
      thumbFillEnabled: 'rgb(50,145,184)',
      thumbFillHighlighted: 'rgb(71,207,255)',
      thumbFillDisabled: '#F0F0F0',
      majorTickLength: 30,
      minorTickLength: 16,
      endDrag: function() { /* do nothing */ } // called when thumb is released at end of drag sequence
    };

    // fill in options with defaults
    thisSlider._options = _.extend( defaultOptions, options );

    // ticks are added to this parent, so they are behind knob
    thisSlider._ticksParent = new Node();
    thisSlider.addChild( thisSlider._ticksParent );

    // track
    thisSlider._track = new Rectangle( 0, 0, thisSlider._options.trackSize.width, thisSlider._options.trackSize.height, { fill: 'white', stroke: 'black', lineWidth: 1 } );
    thisSlider.addChild( thisSlider._track );

    // thumb, points up
    var arcWidth = 0.25 * this._options.thumbSize.width;
    var thumbFill = enabledProperty.get() ? thisSlider._options.thumbFillEnabled : thisSlider._options.thumbFillDisabled;
    var thumb = new Rectangle( -thisSlider._options.thumbSize.width / 2, -thisSlider._options.thumbSize.height / 2, thisSlider._options.thumbSize.width, thisSlider._options.thumbSize.height, arcWidth, arcWidth,
      { cursor: 'pointer', fill: thumbFill, stroke: 'black', lineWidth: 1 } );
    var centerLineYMargin = 3;
    thumb.addChild( new Path( Shape.lineSegment( 0, -( thisSlider._options.thumbSize.height / 2 ) + centerLineYMargin, 0, ( thisSlider._options.thumbSize.height / 2 ) - centerLineYMargin ), { stroke: 'white' } ) );
    thumb.centerY = thisSlider._track.centerY;
    thisSlider.addChild( thumb );

    // thumb touch area
    var dx = 0.5 * thumb.width;
    var dy = 0.25 * thumb.height;
    thumb.touchArea = Shape.rectangle( ( -thumb.width / 2 ) - dx, ( -thumb.height / 2 ) - dy, thumb.width + dx + dx, thumb.height + dy + dy );

    // mapping between value and track position
    thisSlider._valueToPosition = new LinearFunction( range.min, range.max, 0, this._options.trackSize.width, true /* clamp */ );

    // highlight on mouse enter
    thumb.addInputListener( new FillHighlightListener( thisSlider._options.thumbFillEnabled, thisSlider._options.thumbFillHighlighted, enabledProperty ) );

    // update value when thumb is dragged
    var clickXOffset = 0; // x-offset between initial click and thumb's origin
    var dragHandler = new SimpleDragHandler( {
      allowTouchSnag: true,
      start: function( event ) {
        clickXOffset = thumb.globalToParentPoint( event.pointer.point ).x - thumb.x;
      },
      drag: function( event ) {
        if ( enabledProperty.get() ) {
          var x = thumb.globalToParentPoint( event.pointer.point ).x - clickXOffset;
          valueProperty.set( thisSlider._valueToPosition.inverse( x ) );
        }
      },
      end: function() {
        thisSlider._options.endDrag();
      },
      translate: function() { /* override default behavior, do nothing */ }
    } );
    thumb.addInputListener( dragHandler );

    // enable/disable thumb
    enabledProperty.link( function( enabled ) {
      thumb.fill = enabled ? thisSlider._options.thumbFillEnabled : thisSlider._options.thumbFillDisabled;
      thumb.cursor = enabled ? 'pointer' : 'default';
      if ( !enabled && dragHandler.dragging ) {
        dragHandler.endDrag();
      }
    } );

    // update thumb location when value changes
    valueProperty.link( function( value ) {
      thumb.centerX = thisSlider._valueToPosition( value );
    } );

    thisSlider.mutate( _.omit( thisSlider._options, Object.keys( defaultOptions ) ) );
  }

  inherit( Node, HSlider, {

    /**
     * Adds a major tick mark.
     * @param {Number} value
     * @param {Node} label optional
     */
    addMajorTick: function( value, label ) {
      this._addTick( this._options.majorTickLength, value, label );
    },

    /**
     * Adds a minor tick mark.
     * @param {Number} value
     * @param {Node} label optional
     */
    addMinorTick: function( value, label ) {
      this._addTick( this._options.majorTickLength, value, label );
    },

    /*
     * Adds a tick mark above the track.
     * @param {Number} tickLength
     * @param {Number} value
     * @param {Node} label optional
     */
    _addTick: function( tickLength, value, label ) {
      var labelX = this._valueToPosition( value );
      // ticks
      var tick = new Path( new Shape()
        .moveTo( labelX, this._track.top )
        .lineTo( labelX, this._track.bottom - tickLength ),
        { lineWidth: 1, stroke: 'black' } );
      this._ticksParent.addChild( tick );
      // label
      if ( label ) {
        this._ticksParent.addChild( label );
        label.centerX = tick.centerX;
        label.bottom = tick.top - 6;
      }
    }
  } );

  return HSlider;
} );