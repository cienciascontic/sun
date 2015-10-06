// Copyright 2002-2015, University of Colorado Boulder

/**
 * An iOS-style page control. See the 'Navigation' section of the iOS Human Interface Guidelines.
 * A page control indicates the number of pages and which one is currently visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param {number} numberOfPages - number of pages
   * @param {Property<number>} pageNumberProperty - which page is currently visible
   * @param {Object} [options]
   * @constructor
   */
  function PageControl( numberOfPages, pageNumberProperty, options ) {

    options = _.extend( {

      //TODO support multiple types of interactivity? see https://github.com/phetsims/sun/issues/199
      interactive: false, // {boolean} whether the control is interactive

      // all dots
      orientation: 'horizontal',
      dotRadius: 3, // {number} radius of the dots
      lineWidth: 1,
      dotSpacing: 10, // {number} spacing between dots

      // dots representing the current page
      currentPageFill: 'black', // {Color|string} dot color for the page that is visible
      currentPageStroke: null,

      // dots representing all pages except the current page
      pageFill: 'rgb( 200, 200, 200 )', // {Color|string} dot color for pages that are not visible
      pageStroke: null

    }, options );

    // validate options
    assert && assert( _.contains( [ 'horizontal', 'vertical' ], options.orientation ), 'invalid orientation=' + options.orientation );

    // To improve readability
    var isHorizontal = ( options.orientation === 'horizontal' );

    // Clicking on a dot goes to that page
    var dotListener = new DownUpListener( {
      down: function( event ) {
        assert && assert( event.currentTarget.hasOwnProperty( 'pageNumber' ) );
        pageNumberProperty.set( event.currentTarget.pageNumber );
      }
    } );

    // Create a dot for each page.
    // Add them to an intermediate parent node, so that additional children can't be inadvertently added.
    // For horizontal orientation, pages are ordered left-to-right.
    // For vertical orientation, pages are ordered top-to-bottom.
    var dotsParent = new Node();
    for ( var pageNumber = 0; pageNumber < numberOfPages; pageNumber++ ) {

      // dot
      var dotCenter = ( pageNumber * ( 2 * options.dotRadius + options.dotSpacing ) );
      var dotNode = new DotNode( pageNumber, options.dotRadius, {
        fill: options.pageFill,
        stroke: options.pageStroke,
        lineWidth: options.lineWidth,
        x: isHorizontal ? dotCenter : 0,
        y: isHorizontal ? 0 : dotCenter
      } );
      dotsParent.addChild( dotNode );

      // optional interactivity
      if ( options.interactive ) {
        dotNode.cursor = 'pointer';
        dotNode.addInputListener( dotListener );
      }
    }

    // Indicate which page is selected
    var pageNumberObserver = function( pageNumber, oldPageNumber ) {

      // previous dot
      if ( oldPageNumber || oldPageNumber === 0 ) {
        dotsParent.getChildAt( oldPageNumber ).fill = options.pageFill;
        dotsParent.getChildAt( oldPageNumber ).stroke = options.pageStroke;
      }

      // current dot
      dotsParent.getChildAt( pageNumber ).fill = options.currentPageFill;
      dotsParent.getChildAt( pageNumber ).stroke = options.currentPageStroke;
    };
    pageNumberProperty.link( pageNumberObserver );

    // @private
    this.disposePageControl = function() {
      pageNumberProperty.unlink( pageNumberObserver );
    };

    options.children = [ dotsParent ];
    Node.call( this, options );
  }

  /**
   * @param {number} pageNumber - page number that the dot is associated with
   * @param {number} radius
   * @param {Object} [options]
   * @constructor
   */
  function DotNode( pageNumber, radius, options ) {
    this.pageNumber = pageNumber; // @public (read-only)
    Circle.call( this, radius, options );
  }

  inherit( Circle, DotNode );

  return inherit( Node, PageControl, {

    // @public
    dispose: function() { this.disposePageControl(); }
  } );
} );