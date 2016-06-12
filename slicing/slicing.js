/**
 * Created by taohan on 16/6/6.
 */
package {
import flash.display.Sprite;
import flash.events.Event;
import flash.events.MouseEvent;
import flash.geom.Matrix;
import flash.display.BitmapData;
import Box2D.Dynamics.*;
import Box2D.Collision.*;
import Box2D.Collision.Shapes.*;
import Box2D.Common.Math.*;
    public class Main extends Sprite {
        private var world:b2World=new b2World(new b2Vec2(0,10),true);
        // You can see the reason for creating the enterPointsVec in the coments in the intersection() method.
        private var enterPointsVec:Vector.<b2Vec2> = new Vector.<b2Vec2>();
        private var numEnterPoints:int=0;
        private var worldScale:Number=30;
        // custom contact listener
        private var customContact=new CustomContactListener();
        public function Main() {
            // defining the custom contact listener
            world.SetContactListener(customContact);
            // calling the debug draw. This is used to show you the bitmaps are correctly applied,
            // and because I did not want to draw the walls :)
            debugDraw();
            // this is the BitmapData representation of the wood
            // check the library to see both the raw image and the sprite
            var woodBitmap:BitmapData=new BitmapData(50,400);
            woodBitmap.draw(new WoodImage());
            // adding the four static, undestroyable walls;
            addWall(320,480,640,20);
            addWall(320,0,640,20);
            addWall(0,240,20,480);
            addWall(640,240,20,480);
            // createBody builds the final body and applies the bitmap.
            createBody(400,270,new <b2Vec2>[new b2Vec2(-25,-200),new b2Vec2(25,-200),new b2Vec2(25,200),new b2Vec2(-25,200)],woodBitmap);
            // You can see the reason for creating the enterPointsVec in the coments in the intersection() method.
            enterPointsVec=new Vector.<b2Vec2>(numEnterPoints);
            // listeners
            stage.addEventListener(MouseEvent.MOUSE_DOWN, shoot);
            addEventListener(Event.ENTER_FRAME, update);
        }
        // my old friend debugDraw function
        private function debugDraw():void {
            var debugDraw:b2DebugDraw = new b2DebugDraw();
            var debugSprite:Sprite = new Sprite();
            addChild(debugSprite);
            debugDraw.SetSprite(debugSprite);
            debugDraw.SetDrawScale(worldScale);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit|b2DebugDraw.e_jointBit);
            debugDraw.SetFillAlpha(0.5);
            world.SetDebugDraw(debugDraw);
        }
        // function that will add the sphere and launch it
        // arguments are respectively x position, y position, radius, x velocity and y velocity
        private function addSphere(pX:Number,pY:Number,r:Number,vX:Number,vY:Number):void {
            var theSphere:b2Body;
            var sphereShape:b2CircleShape=new b2CircleShape(r/worldScale);
            var sphereFixture:b2FixtureDef = new b2FixtureDef();
            sphereFixture.density=1;
            sphereFixture.friction=3;
            sphereFixture.restitution=0.1;
            sphereFixture.shape=sphereShape;
            var sphereBodyDef:b2BodyDef = new b2BodyDef();
            sphereBodyDef.type=b2Body.b2_dynamicBody;
            sphereBodyDef.position.Set(pX/worldScale,pY/worldScale);
            sphereBodyDef.bullet=true;
            sphereBodyDef.userData={assetName:"sphere",collided:false};
            theSphere=world.CreateBody(sphereBodyDef);
            theSphere.CreateFixture(sphereFixture);
            theSphere.SetLinearVelocity(new b2Vec2(vX,vY));
        }
        // simple function to add a static wall
        private function addWall(pX:Number,pY:Number,w:Number,h:Number):void {
            var wallShape:b2PolygonShape = new b2PolygonShape();
            wallShape.SetAsBox(w/worldScale/2,h/worldScale/2);
            var wallFixture:b2FixtureDef = new b2FixtureDef();
            wallFixture.density=0;
            wallFixture.friction=1;
            wallFixture.restitution=0.5;
            wallFixture.shape=wallShape;
            var wallBodyDef:b2BodyDef = new b2BodyDef();
            wallBodyDef.position.Set(pX/worldScale,pY/worldScale);
            wallBodyDef.userData={assetName:"wall"};
            var wall:b2Body=world.CreateBody(wallBodyDef);
            wall.CreateFixture(wallFixture);
            numEnterPoints++;
        }
        // function to create and texture a dynamic body
        private function createBody(xPos:Number, yPos:Number, verticesArr:Vector.<b2Vec2>, texture:BitmapData) {
            // I need this temp vector to convert pixels coordinates to Box2D meters coordinates
            var vec:Vector.<b2Vec2>=new Vector.<b2Vec2>();
            for (var i:Number=0; i<verticesArr.length; i++) {
                vec.push(new b2Vec2(verticesArr[i].x/worldScale,verticesArr[i].y/worldScale));
            }
            var bodyDef:b2BodyDef = new b2BodyDef();
            bodyDef.type=b2Body.b2_dynamicBody;
            var boxDef:b2PolygonShape = new b2PolygonShape();
            boxDef.SetAsVector(vec);
            bodyDef.position.Set(xPos/worldScale, yPos/worldScale);
            // custom userData used to map the texture;
            bodyDef.userData={assetName:"wood",textureData:new userData(numEnterPoints,vec,texture)};
            addChild(bodyDef.userData.textureData);
            var fixtureDef:b2FixtureDef = new b2FixtureDef();
            fixtureDef.density=1;
            fixtureDef.friction=0.2;
            fixtureDef.restitution=0.5;
            fixtureDef.shape=boxDef;
            var tempBox:b2Body=world.CreateBody(bodyDef);
            tempBox.CreateFixture(fixtureDef);
            numEnterPoints++;
        }
        // function to shoot the ball
        private function shoot(e:MouseEvent) {
            addSphere(20,240,15,50,Math.random()*40-20);
            stage.removeEventListener(MouseEvent.MOUSE_DOWN,shoot);
        }
        // update function to simulate and render the world
        public function update(e:Event):void {
            world.Step(1/300, 10, 10);
            world.ClearForces();
            var spr:Sprite;
            for (var b:b2Body = world.GetBodyList(); b; b = b.GetNext()) {
                if (b.GetUserData()!=null) {
                    // according to the collision listener, I am here when the sphere hits the wood
                    if (b.GetUserData().assetName=="sphere"&&b.GetUserData().collided) {
                        // retrieving sphere velocity
                        var sphereVelocity:b2Vec2=b.GetLinearVelocity();
                        // getting direction according to velocity
                        var sphereDirection:Number=Math.atan2(sphereVelocity.y,sphereVelocity.x);
                        // getting sphere position
                        var colX:Number=b.GetPosition().x;
                        var colY:Number=b.GetPosition().y;
                        // clone the sphere
                        addSphere(colX*worldScale,colY*worldScale,15,sphereVelocity.x,sphereVelocity.y);
                        // perform the raycast
                        world.RayCast(intersection, new b2Vec2(colX,colY), new b2Vec2(colX+5*Math.cos(sphereDirection),colY+5*Math.sin(sphereDirection)));
                        world.RayCast(intersection, new b2Vec2(colX+5*Math.cos(sphereDirection),colY+5*Math.sin(sphereDirection)), new b2Vec2(colX,colY));
                        // destroy the original sphere
                        world.DestroyBody(b);
                    }
                }
            }
            // update graphics on stage
            for (b = world.GetBodyList(); b; b = b.GetNext()) {
                if (b.GetUserData()!=null) {
                    spr=b.GetUserData().textureData;
                    if (spr) {
                        spr.x=b.GetPosition().x*worldScale;
                        spr.y=b.GetPosition().y*worldScale;
                        spr.rotation=b.GetAngle()*180/Math.PI;
                    }
                }
            }
            world.DrawDebugData();
        }
        private function intersection(fixture:b2Fixture, point:b2Vec2, normal:b2Vec2, fraction:Number):Number {
            if (fixture.GetBody().GetUserData()) {
                if (fixture.GetBody().GetUserData().textureData!=null) {
                    var spr:Sprite=fixture.GetBody().GetUserData().textureData;
                    // Throughout this whole code I use only one global vector, and that is enterPointsVec. Why do I need it you ask?
                    // Well, the problem is that the world.RayCast() method calls this function only when it sees that a given line gets into the body - it doesnt see when the line gets out of it.
                    // I must have 2 intersection points with a body so that it can be sliced, thats why I use world.RayCast() again, but this time from B to A - that way the point, at which BA enters the body is the point at which AB leaves it!
                    // For that reason, I use a vector enterPointsVec, where I store the points, at which AB enters the body. And later on, if I see that BA enters a body, which has been entered already by AB, I fire the splitObj() function!
                    // I need a unique ID for each body, in order to know where its corresponding enter point is - I store that id in the userData of each body.
                    if (spr is userData) {
                        var userD:userData=spr as userData;
                        if (enterPointsVec[userD.id]) {
                            // If this body has already had an intersection point, then it now has two intersection points, thus it must be split in two - thats where the splitObj() method comes in.
                            splitObj(fixture.GetBody(), enterPointsVec[userD.id], point.Copy());
                        }
                        else {
                            enterPointsVec[userD.id]=point;
                        }
                    }
                }
            }
            return 1;
        }
        // function to get the area of a shape. I will remove tiny shape to increase performance
        private function getArea(vs:Vector.<b2Vec2>, count:uint):Number {
            var area:Number=0.0;
            var p1X:Number=0.0;
            var p1Y:Number=0.0;
            var inv3:Number=1.0/3.0;
            for (var i:int = 0; i < count; ++i) {
                var p2:b2Vec2=vs[i];
                var p3:b2Vec2=i+1<count?vs[int(i+1)]:vs[0];
                var e1X:Number=p2.x-p1X;
                var e1Y:Number=p2.y-p1Y;
                var e2X:Number=p3.x-p1X;
                var e2Y:Number=p3.y-p1Y;
                var D:Number = (e1X * e2Y - e1Y * e2X);
                var triangleArea:Number=0.5*D;
                area+=triangleArea;
            }
            return area;
        }
        private function splitObj(sliceBody:b2Body, A:b2Vec2, B:b2Vec2):void {
            var origFixture:b2Fixture=sliceBody.GetFixtureList();
            var poly:b2PolygonShape=origFixture.GetShape() as b2PolygonShape;
            var verticesVec:Vector.<b2Vec2>=poly.GetVertices(),numVertices:int=poly.GetVertexCount();
            var shape1Vertices:Vector.<b2Vec2> = new Vector.<b2Vec2>(), shape2Vertices:Vector.<b2Vec2> = new Vector.<b2Vec2>();
            var origUserData:userData=sliceBody.GetUserData().textureData,origUserDataId:int=origUserData.id,d:Number;
            var polyShape:b2PolygonShape=new b2PolygonShape();
            var body:b2Body;
            // First, I destroy the original body and remove its Sprite representation from the childlist.
            world.DestroyBody(sliceBody);
            removeChild(origUserData);
            // The world.RayCast() method returns points in world coordinates, so I use the b2Body.GetLocalPoint() to convert them to local coordinates.;
            A=sliceBody.GetLocalPoint(A);
            B=sliceBody.GetLocalPoint(B);
            // I use shape1Vertices and shape2Vertices to store the vertices of the two new shapes that are about to be created.
            // Since both point A and B are vertices of the two new shapes, I add them to both vectors.
            shape1Vertices.push(A, B);
            shape2Vertices.push(A, B);
            // I iterate over all vertices of the original body. ;
            // I use the function det() ("det" stands for "determinant") to see on which side of AB each point is standing on. The parameters it needs are the coordinates of 3 points:
            // - if it returns a value >0, then the three points are in clockwise order (the point is under AB)
            // - if it returns a value =0, then the three points lie on the same line (the point is on AB)
            // - if it returns a value <0, then the three points are in counter-clockwise order (the point is above AB).
            for (var i:Number=0; i<numVertices; i++) {
                d=det(A.x,A.y,B.x,B.y,verticesVec[i].x,verticesVec[i].y);
                if (d>0) {
                    shape1Vertices.push(verticesVec[i]);
                }
                else {
                    shape2Vertices.push(verticesVec[i]);
                }
            }
            // In order to be able to create the two new shapes, I need to have the vertices arranged in clockwise order.
            // I call my custom method, arrangeClockwise(), which takes as a parameter a vector, representing the coordinates of the shape's vertices and returns a new vector, with the same points arranged clockwise.
            shape1Vertices=arrangeClockwise(shape1Vertices);
            shape2Vertices=arrangeClockwise(shape2Vertices);
            // setting the properties of the two newly created shapes
            var bodyDef:b2BodyDef = new b2BodyDef();
            bodyDef.type=b2Body.b2_dynamicBody;
            bodyDef.position=sliceBody.GetPosition();
            var fixtureDef:b2FixtureDef = new b2FixtureDef();
            fixtureDef.density=origFixture.GetDensity();
            fixtureDef.friction=origFixture.GetFriction();
            fixtureDef.restitution=origFixture.GetRestitution();
            // creating the first shape, if big enough
            if (getArea(shape1Vertices,shape1Vertices.length)>=0.05) {
                polyShape.SetAsVector(shape1Vertices);
                fixtureDef.shape=polyShape;
                bodyDef.userData={assetName:"debris",textureData:new userData(origUserDataId,shape1Vertices,origUserData.texture)};
                addChild(bodyDef.userData.textureData);
                enterPointsVec[origUserDataId]=null;
                body=world.CreateBody(bodyDef);
                body.SetAngle(sliceBody.GetAngle());
                body.CreateFixture(fixtureDef);
            }
            // creating the second shape, if big enough;
            if (getArea(shape2Vertices,shape2Vertices.length)>=0.05) {
                polyShape.SetAsVector(shape2Vertices);
                fixtureDef.shape=polyShape;
                bodyDef.userData={assetName:"debris",textureData:new userData(origUserDataId,shape2Vertices,origUserData.texture)};
                addChild(bodyDef.userData.textureData);
                enterPointsVec.push(null);
                numEnterPoints++;
                body=world.CreateBody(bodyDef);
                body.SetAngle(sliceBody.GetAngle());
                body.CreateFixture(fixtureDef);
            }
        }
        private function arrangeClockwise(vec:Vector.<b2Vec2>):Vector.<b2Vec2> {
            // The algorithm is simple:
            // First, it arranges all given points in ascending order, according to their x-coordinate.
            // Secondly, it takes the leftmost and rightmost points (lets call them C and D), and creates tempVec, where the points arranged in clockwise order will be stored.
            // Then, it iterates over the vertices vector, and uses the det() method I talked about earlier. It starts putting the points above CD from the beginning of the vector, and the points below CD from the end of the vector.
            // That was it!
            var n:int=vec.length,d:Number,i1:int=1,i2:int=n-1;
            var tempVec:Vector.<b2Vec2>=new Vector.<b2Vec2>(n),C:b2Vec2,D:b2Vec2;
            vec.sort(comp1);
            tempVec[0]=vec[0];
            C=vec[0];
            D=vec[n-1];
            for (var i:Number=1; i<n-1; i++) {
                d=det(C.x,C.y,D.x,D.y,vec[i].x,vec[i].y);
                if (d<0) {
                    tempVec[i1++]=vec[i];
                }
                else {
                    tempVec[i2--]=vec[i];
                }
            }
            tempVec[i1]=vec[n-1];
            return tempVec;
        }
        private function comp1(a:b2Vec2, b:b2Vec2):Number {
            // This is a compare function, used in the arrangeClockwise() method - a fast way to arrange the points in ascending order, according to their x-coordinate.
            if (a.x>b.x) {
                return 1;
            }
            else if (a.x<b.x) {
                return -1;
            }
            return 0;
        }
        private function det(x1:Number, y1:Number, x2:Number, y2:Number, x3:Number, y3:Number):Number {
            // This is a function which finds the determinant of a 3x3 matrix.
            // If you studied matrices, you'd know that it returns a positive number if three given points are in clockwise order, negative if they are in anti-clockwise order and zero if they lie on the same line.
            // Another useful thing about determinants is that their absolute value is two times the face of the triangle, formed by the three given points.
            return x1*y2+x2*y3+x3*y1-y1*x2-y2*x3-y3*x1;
        }
    }
}