// Copyright 2002-2013, University of Colorado Boulder

/**
 * Provides access to font-awesome glyphs as scenery nodes.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Image = require( 'SCENERY/nodes/Image' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var DOM = require( 'SCENERY/nodes/DOM' );
  var Node = require( 'SCENERY/nodes/Node' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Scene = require( 'SCENERY/Scene' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var inherit = require( 'PHET_CORE/inherit' );

  // Generated using chipper.FontAwesomeToScenery
  var icons = {
    fullscreen: "M1283 995l-355 -355l355 -355l144 144q29 31 70 14q39 -17 39 -59v-448q0 -26 -19 -45t-45 -19h-448q-42 0 -59 40q-17 39 14 69l144 144l-355 355l-355 -355l144 -144q31 -30 14 -69q-17 -40 -59 -40h-448q-26 0 -45 19t-19 45v448q0 42 40 59q39 17 69 -14l144 -144 l355 355l-355 355l-144 -144q-19 -19 -45 -19q-12 0 -24 5q-40 17 -40 59v448q0 26 19 45t45 19h448q42 0 59 -40q17 -39 -14 -69l-144 -144l355 -355l355 355l-144 144q-31 30 -14 69q17 40 59 40h448q26 0 45 -19t19 -45v-448q0 -42 -39 -59q-13 -5 -25 -5q-26 0 -45 19z",
    reorder: "M1536 192v-128q0 -26 -19 -45t-45 -19h-1408q-26 0 -45 19t-19 45v128q0 26 19 45t45 19h1408q26 0 45 -19t19 -45zM1536 704v-128q0 -26 -19 -45t-45 -19h-1408q-26 0 -45 19t-19 45v128q0 26 19 45t45 19h1408q26 0 45 -19t19 -45zM1536 1216v-128q0 -26 -19 -45 t-45 -19h-1408q-26 0 -45 19t-19 45v128q0 26 19 45t45 19h1408q26 0 45 -19t19 -45z",
    home: "M1408 544v-480q0 -26 -19 -45t-45 -19h-384v384h-256v-384h-384q-26 0 -45 19t-19 45v480q0 1 0.5 3t0.5 3l575 474l575 -474q1 -2 1 -6zM1631 613l-62 -74q-8 -9 -21 -11h-3q-13 0 -21 7l-692 577l-692 -577q-12 -8 -24 -7q-13 2 -21 11l-62 74q-8 10 -7 23.5t11 21.5 l719 599q32 26 76 26t76 -26l244 -204v195q0 14 9 23t23 9h192q14 0 23 -9t9 -23v-408l219 -182q10 -8 11 -21.5t-7 -23.5z",
    volume_off: "M768 1184v-1088q0 -26 -19 -45t-45 -19t-45 19l-333 333h-262q-26 0 -45 19t-19 45v384q0 26 19 45t45 19h262l333 333q19 19 45 19t45 -19t19 -45z",
    volume_up: "M768 1184v-1088q0 -26 -19 -45t-45 -19t-45 19l-333 333h-262q-26 0 -45 19t-19 45v384q0 26 19 45t45 19h262l333 333q19 19 45 19t45 -19t19 -45zM1152 640q0 -76 -42.5 -141.5t-112.5 -93.5q-10 -5 -25 -5q-26 0 -45 18.5t-19 45.5q0 21 12 35.5t29 25t34 23t29 35.5 t12 57t-12 57t-29 35.5t-34 23t-29 25t-12 35.5q0 27 19 45.5t45 18.5q15 0 25 -5q70 -27 112.5 -93t42.5 -142zM1408 640q0 -153 -85 -282.5t-225 -188.5q-13 -5 -25 -5q-27 0 -46 19t-19 45q0 39 39 59q56 29 76 44q74 54 115.5 135.5t41.5 173.5t-41.5 173.5 t-115.5 135.5q-20 15 -76 44q-39 20 -39 59q0 26 19 45t45 19q13 0 26 -5q140 -59 225 -188.5t85 -282.5zM1664 640q0 -230 -127 -422.5t-338 -283.5q-13 -5 -26 -5q-26 0 -45 19t-19 45q0 36 39 59q7 4 22.5 10.5t22.5 10.5q46 25 82 51q123 91 192 227t69 289t-69 289 t-192 227q-36 26 -82 51q-7 4 -22.5 10.5t-22.5 10.5q-39 23 -39 59q0 26 19 45t45 19q13 0 26 -5q211 -91 338 -283.5t127 -422.5z",
    check: "M1408 606v-318q0 -119 -84.5 -203.5t-203.5 -84.5h-832q-119 0 -203.5 84.5t-84.5 203.5v832q0 119 84.5 203.5t203.5 84.5h832q63 0 117 -25q15 -7 18 -23q3 -17 -9 -29l-49 -49q-10 -10 -23 -10q-3 0 -9 2q-23 6 -45 6h-832q-66 0 -113 -47t-47 -113v-832 q0 -66 47 -113t113 -47h832q66 0 113 47t47 113v254q0 13 9 22l64 64q10 10 23 10q6 0 12 -3q20 -8 20 -29zM1639 1095l-814 -814q-24 -24 -57 -24t-57 24l-430 430q-24 24 -24 57t24 57l110 110q24 24 57 24t57 -24l263 -263l647 647q24 24 57 24t57 -24l110 -110 q24 -24 24 -57t-24 -57z",
    check_empty: "M1120 1280h-832q-66 0 -113 -47t-47 -113v-832q0 -66 47 -113t113 -47h832q66 0 113 47t47 113v832q0 66 -47 113t-113 47zM1408 1120v-832q0 -119 -84.5 -203.5t-203.5 -84.5h-832q-119 0 -203.5 84.5t-84.5 203.5v832q0 119 84.5 203.5t203.5 84.5h832 q119 0 203.5 -84.5t84.5 -203.5z",
    undo: "M1536 640q0 -156 -61 -298t-164 -245t-245 -164t-298 -61q-179 0 -336.5 76t-266 213t-147.5 312q-3 14 7 27q9 12 25 12h199q23 0 30 -23q50 -162 185 -261.5t304 -99.5q104 0 198.5 40.5t163.5 109.5t109.5 163.5t40.5 198.5t-40.5 198.5t-109.5 163.5t-163.5 109.5 t-198.5 40.5q-98 0 -188 -35.5t-160 -101.5l137 -138q31 -30 14 -69q-17 -40 -59 -40h-448q-26 0 -45 19t-19 45v448q0 42 40 59q39 17 69 -14l130 -129q107 101 244.5 156.5t284.5 55.5q156 0 298 -61t245 -164t164 -245t61 -298z"
  };

  function FontAwesomeNode( iconName, options ) {

    // default values
    options = _.extend( {
      fill: "#000",
      //Font awesome nodes are expensive to pick (and have a lot of holes in them which you may wish to pick anyways, such as the door of the 'home' icon, so don't pick by default
      pickable: false
    }, options );

    // add internal values required by supertype constructor
    options = _.extend( options, {
      matrix: new Matrix3( 0.025, 0, 0, 0, -0.025, 0, 0, 0, 1 )
    } );

    Path.call( this, new Shape( icons[iconName] ), options );
  }

  inherit( Path, FontAwesomeNode );

  return FontAwesomeNode;
} );