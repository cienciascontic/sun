//Render a simple panel around a content node
//TODO: not ready for use in simulations, it will need further development & discussion first.
define( function( require ) {
  "use strict";

  var Node = require( 'SCENERY/nodes/Node' );
  var DOM = require( 'SCENERY/nodes/DOM' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function PanelNode( content, options ) {
    options = options || {};
    var fill = options.fill || 'white';
    var stroke = options.stroke || 'black';
    var lineWidth = options.lineWidth || 1;
    Node.call( this );

    this.path = new Rectangle( 0, 0, content.width + 10, content.height + 10, 10, 10, {stroke: stroke, lineWidth: lineWidth, fill: fill} );
    this.addChild( this.path );
    content.centerX = this.path.width / 2;
    content.centerY = this.path.height / 2;
    this.addChild( content );

    //Apply options after the layout done so that options that use the bounds will work properly
    if ( options ) {
      this.mutate( options );
    }
  }

  inherit( PanelNode, Node );

  return PanelNode;
} );