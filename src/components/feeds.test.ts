import { parseFeed } from './feeds';
import { readFileSync } from 'fs';
import { IBlogPost } from './blog-posts';

describe('feeds', () => {
  describe('parseFeed()', () => {
    it('should throw if unparsedFeedXML is an empty string', async () => {
      try {
        await parseFeed('');
      } catch (e) {
        expect(e.message).toEqual('Valid XML Required');
      }
    });

    it('should throw if unparsedFeedXML is not a valid XML document', async () => {
      const invalidXML = '<?xml version = "1.0"?><data><<</data>';
      try {
        await parseFeed(invalidXML);
      } catch (e) {
        expect(e.message).toEqual('Valid XML Required');
      }
    });

    it("should throw if unparsedFeedXML is valid XML but isn't a valid ATOM/RSS feed", async () => {
      const validXMLNotAFeed = '<?xml version = "1.0"?><notAFeed></notAFeed>';
      try {
        await parseFeed(validXMLNotAFeed);
      } catch (e) {
        expect(e.message).toEqual('XML is not an RSS or ATOM feed');
      }
    });

    describe('real-life examples', () => {
      it('should correctly parse minimum.rss', async () => {
        const minimumRSS = readFileSync('./src/test-data/rss/minimum.rss').toString();

        const expectedItems: IBlogPost[] = [
          {
            title: "You won't believe what happened next!",
            link: 'http://example.com/what-happened-next',
            imageUrl: null,
            description: 'Something uninteresting, you got click baited!',
            dateUpdated: null,
            datePublished: null,
          },
          {
            title: 'Blog Authors hate him!',
            link: 'http://example.com/blog-authors-hate-him',
            imageUrl: null,
            description: null,
            dateUpdated: null,
            datePublished: null,
          },
        ];

        expect(await parseFeed(minimumRSS)).toEqual(expectedItems);
      });

      it('should correctly parse blogger.atom', async () => {
        const bloggerATOM = readFileSync('./src/test-data/atom/blogger.atom').toString();

        const expectedItems: IBlogPost[] = [
          {
            title: 'Graphics Work',
            link: 'http://richardbamford.blogspot.com/2016/02/graphics-work.html',
            description:
              "A quick update on what I've been working on recently.For one of my modules Simulations and 3D Graphics, we were set a task to learn lighting and materials. So far I have implemented a single light, using ADS and blinn-phong (again).The camera can rotate, move forward/backward. The armadillo can be rotated on it's pedestal and the whole scene can be rotated.",
            imageUrl:
              'https://1.bp.blogspot.com/-74kEkoti2zU/Vs84kp7mLdI/AAAAAAAAEM0/MFcbjuNxPM8/s640/2016-02-25_17-18-06.png',
            dateUpdated: new Date('2016-02-25T09:25:27.716-08:00'),
            datePublished: new Date('2016-02-25T09:25:00.001-08:00'),
          },
          {
            title: 'Project 5: Stanford dragon rendering',
            link:
              'http://richardbamford.blogspot.com/2016/02/project-5-stanford-dragon-rendering.html',
            description:
              'This dragon is one of the many models which the Stanford University Computer Graphics Laboratory scanned. More info http://graphics.stanford.edu/data/3Dscanrep/. I used this to practice for an upcoming module, it is made in OpenTK and uses OpenGL 4.5. Work for this included:Loading vertex and normal data from .OBJ.Parsing material file for Blinn-Phong attributes.Blinn-Phong glsl shaders.Setting model/view/projection matrices.Configuring camera and light positions.',
            imageUrl: null,
            dateUpdated: new Date('2016-02-07T07:52:10.279-08:00'),
            datePublished: new Date('2016-02-07T07:52:00.000-08:00'),
          },
          {
            title: 'Project 4: Ray casting with a 2d graphics library.',
            link:
              'http://richardbamford.blogspot.com/2016/02/project-4-ray-casting-with-2d-graphics.html',
            description:
              "Implementing this using one of my favorite frameworks (https://love2d.org/) in Lua was a lot of fun!This is heavily inspired by Wolfenstein 3D.It involved simple trigonometry, calculating ray/shape intersections, figuring out how to map textures and lighting effects. A problem I encountered was a fisheye lens effect, because for each ray projected into the world, I would map the intersection distance directly to the height a wall (which is a group of line slices). However what I needed to do was calculate the perpendicular distance of the intersection using the projection plane as a reference.Fish-lens effectHere's a great image which helped me understand the problem a lot, originally my raycasting method resembled the one of the far right.Here are the resources I used:http://permadi.com/1996/05/ray-casting-tutorial-table-of-contents/ - Help with the projection plane/intersection distance calculation.https://en.wikipedia.org/wiki/Linear_interpolation - How I map the texture coordinates onto the side of a shape given a set of intersections with it.",
            imageUrl:
              'http://3.bp.blogspot.com/-9cjtEfP2sQo/VrDLiMCoUyI/AAAAAAAAEMI/qyUEqsLw1GA/s640/love_2016-02-01_14-32-10.png',
            dateUpdated: new Date('2016-02-02T07:43:29.194-08:00'),
            datePublished: new Date('2016-02-02T07:34:00.000-08:00'),
          },
          {
            title: 'Project 3: Grass Sim',
            link: 'http://richardbamford.blogspot.com/2016/01/project-3-grass-sim.html',
            description:
              'Overview One of the main problems with rendering lots of primitives, is each one requires its own draw call/position definition.A solution to this is instanced rendering, where you give opengl a set of vertices and tell it to render it X amount of times. Since it computes everything internally from then on the cost of it is near 0.Instanced rendering does this (pseudo code):for 0, X doSet Instance IDDrawArrays/DrawElements.etcIn the form of this:GL.DrawArraysInstanced(PrimitiveType.Triangles, 0, 3, X);So now the fun part involves the shaders because each instance cannot be given a unique uniform value (which is what I do normally).Each instance has an ID from 0->X, utilising this in interesting ways allows you to produce cool effects for practically free.Here\'s what I came up with after playing around with it:Video after adding a time uniform: Vertex Shader DetailsTo distribute the triangles uniformly given a number from 0 -> 10,000.int x = int( mod( gl_InstanceID, 100 ) );int z = int( gl_InstanceID / 100 );To offset the period of each triangle\'s sin value (not worked out how to make fake-random numbers on shaders yet). Give uT as a value from 0, 2PI. Remember uT is defined once for all the "grass".float sVal = sin( gl_InstanceID + uT ); oDisplace = vec3( sVal, 0, 0 );ConclusionMy "grass" is nothing like grass yet, I\'ll be posting more in the next few days with any progress. I think colouring them is my next objective and then figuring out that tricky random displacement problem.Here\'s a download link if you want to give it a spin: LINK',
            imageUrl:
              'http://3.bp.blogspot.com/-pEt7AB8J900/VppsrWFAGAI/AAAAAAAAELs/fgYESBcFvqU/s400/2016-01-16_15-59-50.png',
            dateUpdated: new Date('2016-01-16T08:39:07.489-08:00'),
            datePublished: new Date('2016-01-16T08:39:00.002-08:00'),
          },
          {
            title: 'Cloth Simulation Update',
            link: 'http://richardbamford.blogspot.com/2016/01/cloth-simulation-update.html',
            description:
              "Some of the issues I found with the system since my last post:I assumed that all constraints had the same rest length, now it takes into account shear and linear constraint lengths.I only accounted for X,Y properties of each point which caused points to act strangely when close to each other, I have changed it to work in 3D. Although the view only looks 2D. Here's the result:",
            imageUrl: null,
            dateUpdated: new Date('2016-01-14T06:08:11.487-08:00'),
            datePublished: new Date('2016-01-14T06:08:00.000-08:00'),
          },
          {
            title: 'Project 2: Cloth Simulation',
            link: 'http://richardbamford.blogspot.com/2016/01/project-2-cloth-simulation.html',
            description:
              'Cloth simulation using opengl and c#.My previous project was about learning the graphics api opengl (lighting/models/projections/shaders) and I feel like if I wanted to carry it on I would have to start again from scratch using things I learned the first time around.Instead I am focusing on some other concepts which have been on my bucket list for a while now, cloth simulations.In the beginning there were lines and dots.My first task was how to effectively render a "cloth" matrix (?) so that I could visually see the system, this is actually quite a challenge when opengl is focused on 3d not 2d.I set up the model-view-projection matrix using an Orthographic Projection.Then since the original coordinate system goes (0, +Y, 0) up the screen, (+X, 0, 0) along the screen it was not intuitive to debug so I applied a scale of (0, -1, 0) and a translation, because (0, 0, 0) is the center of the screen in opengl, to transform it into Cartesian coordinates.Ok... so now I can draw some dots and lines in the right place.My next task was figuring out the formulas that I needed to use to calculate the forces acting on each dot and how they would interact with each other.There is A LOT of information on the internet about cloth simulations so if you\'re looking for an in-depth overview of it look elsewhere. Personally I started with this useful snippet of a paper which can be found here [1]. After a while there came physics.I knew that cloths can be simulated as a set of point masses connected by springs, thankfully forces on springs are fairly simple to calculate (shown above).So I set up my system where each point mass knows about it\'s neighbors (similar to the game of life) information and made sure all the calculations happen in the right order.The most frustrating part about this ordeal was the coefficients, since my system isn\'t "real" what should Ks and Kd be? In the end I just plugged in several different values and went with the ones which looked the most realistic (still not finished with that bit).This was a huge step because if the damping isn\'t perfect then the points oscillate out of control (practically undamped) or just stay still (overdamped), damping.The top left and right points are "pinned" so the force the exert on their neighbors is proportional to the distance between them and some large constant X. Still not sure about this one.Anyway here is my current product, there is still a lot to do with shear and linear springs (I think?), making the forces propagate across the system nicely, lighting and filling in the lines.It was fun to see the points fly wildly about dragging other points with it on it\'s quest for freedom. Maybe I should implement spring breaking sometime...',
            imageUrl:
              'http://3.bp.blogspot.com/-4jTmvI8SOGQ/VpUEH5zIxYI/AAAAAAAAELM/TXeyyIxPHxQ/s400/Cloth_Simulation_2016-01-11_18-57-39.png',
            dateUpdated: new Date('2016-01-12T06:18:16.008-08:00'),
            datePublished: new Date('2016-01-12T06:11:00.001-08:00'),
          },
          {
            title: 'Sketchy physics simulations.',
            link: 'http://richardbamford.blogspot.com/2016/01/sketchy-physics.html',
            description:
              "Today I attempted to wrap my head around portals...In my simulation, when the spheres reach the bottom of the tube, they are teleported to the right hand surface of the cylinder. Maintaining speed but changing the sphere's direction.Initially I ran into a problem of them gaining energy over time, since the force which pushed them from the portal is proportional to the velocity it hits the bottom and the position of the ball along the horizontal axis.Then after some thinking with my trusty whiteboard...I realised that it was because I wasn't forcing the spheres out with the same amount of energy the spheres had at the bottom of the tube! Momentum!Another issue I had was that spheres would converge, I figured it was something to do with the way I was applying drag to the velocity of the spheres. After all portals can't exist in a real physical model without hacks can they? In my opinion I think this one looks the most... real. Since everything loses energy it makes sense that this would happen \"in real life\" to me?Here's what I mean:But i prefer the look of things when we bend physics a bit, here's what I have now! (Beware it has music)I'm happy with this result and hopefully in the next few days I can iron out all the issues with the collision model, and explain fully how I did it. Right now the collisions are kind of hacky and not optimised. In brief it works through the distance of any sphere to the Y axis and the direction from that sphere to the Y axis.It was really fun getting into physics concepts again! It has been ages since i have implemented things like this. Still my code is quite expensive, it uses a lot of normalising and distance calculations which I want to optimize.See you soon!Here's a link to the program so far: Sphere Simulation",
            imageUrl:
              'http://2.bp.blogspot.com/-kTSC6ElMChI/VpF94IoG01I/AAAAAAAAELA/bXPdtZViKf8/s400/12516658_10207946538003191_1669704460_o.jpg',
            dateUpdated: new Date('2016-01-09T14:13:41.272-08:00'),
            datePublished: new Date('2016-01-09T14:09:00.000-08:00'),
          },
          {
            title: 'OpenGL clipping technique.',
            link: 'http://richardbamford.blogspot.com/2016/01/opengl-clipping-technique.html',
            description:
              'Part of the physics simulation I am working on at the moment involves cutting a cylinder in half, so that spheres have a defined space to interact but we can also view them.First I created a cylinder in 3ds max, with normals included. I didn\'t create the half cylinder because I want to have multiple cylinder objects for the spheres to collide with (also I was interested in the process).So I implemented an extra expression in my GLSL fragment shader, to say: If the X value (the camera looks down the X axis) of a fragment (in worldspace) is < 0 then discard that fragment.Initially, using the `discard` in-built function I got really strange results, with some fragments being removed and some staying. It looked like static on a TV.This problem was solved by implementing alpha blending, and setting the alpha value of fragments I want to discard to 0.0.This was great! however I wanted more control over the clipping (hardcoded at the time), so I decided to define a "clipping plane" (a vector which represents the normal of the plane).Then I find the cosine of the position of any given fragment (in world space) and that clipping plane normal. If that value < 0 then I know that that fragment is behind the "face" of the plane, so it can be discarded. Here\'s the GLSL code to implement that: outColour.a = max(0.0, sign( dot( ClipPlane.xyz, vVaryingPos ) ) ); Where vVaryingPos is the position of the vertex in world space, computed in the vertex shader like: vVaryingPos = ( modelMatrix * vec4( vVertex, 1.0 ) ).xyz;The resulting image was exactly the same, awesome! Now I can do funky things like...Due to face culling and the fact the cylinder only has normals facing inwards, when the back of the cylinder faces us, it isn\'t rendered! See here.',
            imageUrl:
              'http://3.bp.blogspot.com/-G3QD_xhi51Q/VpAhBHbFYMI/AAAAAAAAEKo/E8qryBiypFs/s400/Falling_Spheres_%2528FPS_29.5528360379105%2529_2016-01-08_16-02-18.png',
            dateUpdated: new Date('2016-01-08T13:04:24.160-08:00'),
            datePublished: new Date('2016-01-08T13:04:00.002-08:00'),
          },
          {
            title: 'First programming book arrived!',
            link: 'http://richardbamford.blogspot.com/2016/01/first-programming-book-arrived.html',
            description:
              'Amazon LinkVery pleased with the purchase! Hopefully I can now finish some 3D code I have been tearing my hair out over. It even has sections on Compute Shaders (which I am very interested in, OpenCL is too cryptic for me.).',
            imageUrl:
              'http://1.bp.blogspot.com/-KAnSHTWPwkM/Vo59yCWV-KI/AAAAAAAAEKQ/T5Cn457lfGU/s400/oglsuperbible.jpg',
            dateUpdated: new Date('2016-01-07T07:03:57.088-08:00'),
            datePublished: new Date('2016-01-07T07:03:00.004-08:00'),
          },
          {
            title: 'Ten Golden Usability Rules',
            link: 'http://richardbamford.blogspot.com/2016/01/ten-golden-usability-rules.html',
            description:
              'Taken from Jakob Nielsen in his book `Usability Engineering`.Use simple and natural dialog/language. Since every additional feature or item of information on a screen is one more thing to learn, one more thing to misunderstand and one more thing to search the user interface should be simplified as much as possible. Less is more.Use language that fits the user group. The language should be based on user\'s language and not the system-oriented terms. Translation from one language to another is more than just words. Time, current, phrases, metaphors, measurements all must fit the culture of the user group.Minimize the load on short-term memory. Users should not have to remember information from one part of the interface to another. Instructions of usage should be visible or easily retrievable whenever appropriate.Make the graphical user interface coherent and consistent. The same action should always have the same effect.Give the ability to use shortcuts. Accelerators (unseen by novices) may increase the speed of operation and therefore efficiency through using things like; function keys, command keys, macros, etc.Give feedback to the user\'s actions. The feedback should be given within reasonable time which would make the system more pleasant. At a 0.1s delay the user feels the system is responding immediately, 1s delay is around the limit that humans flow of thought will stay interrupted and a 10s delay is the limit to keep user\'s attention focused on the dialog. As always the user should always have feedback about waiting times, which in itself increases the time people are willing to wait.Avoid error situations. Ask the user for confirmation on actions, avoid having similar commands in the interface.Give clear exit marks. Users make mistakes, so providing an "emergency exit" to leave an unwanted state without having to go through extended dialogue is essential. Eg. Cancel should be offered when the operation takes a long time and backing up actions provided in navigation bars.Give clear and understandable error messages. Similar to 2, provide the user with information that is precise and discrete. They should always be polite and not intimidating for example "ILLEGAL, FATAL ACTION, JOB ABORTED!" is bad.Give clear help and understandable documentation. List the concrete steps that should be carried out, but the help should not be too large.So taking these points into account, what is your opinion on these interfaces? Comment below!1. Blogger2. Sublime Text 33. Word 20134. Windows 10 Store5. Zeuxis Texture Generator 6. Dead Remains Garry\'s mod gamemode This post was a revision exercise for my "2D Graphics and UI Design" module at the University of Hull, all rights reserved to their respective owners.',
            imageUrl:
              'http://4.bp.blogspot.com/-1BRIIrdYkBY/Vov0uFtqEJI/AAAAAAAAEJc/s_cQ1CIpggQ/s640/2016-01-05_16-48-46.png',
            dateUpdated: new Date('2016-01-05T09:08:07.896-08:00'),
            datePublished: new Date('2016-01-05T09:00:00.000-08:00'),
          },
        ];

        expect(await parseFeed(bloggerATOM)).toEqual(expectedItems);
      });

      it('should correctly parse alexs-custom-feed.atom', async () => {
        const alexCustomFeedATOM = readFileSync(
          './src/test-data/atom/alexs-custom-feed.atom'
        ).toString();

        const expectedItems: IBlogPost[] = [
          {
            title: 'Cycling out of the north',
            link: 'http://www.alexpringle.co.uk/cycling-out-of-the-north.html',
            description:
              'Many students spend the few days (weeks) after finishing university drinking heavily and enjoying themselves. I however had my eye on an epic bike ride for a few months and used the downtime as the perfect opportunity to cycle from Hull to Leicester. The whole trip covered 110 miles of Humberside, Lincolnshire and Leicestershire. Passing over the Humber bridge, through Lincoln and through many many villages on the way. It was quite a nice day, conditions were good and my spirits were high throughout. The day started at 6am and I arrived as planned in time for a friends birthday meal out - perfect. All in all, a great day out cycling and much better than stumbling home at 4am.',
            imageUrl: 'http://www.alexpringle.co.uk/images/humber-from-ferriby.png',
            dateUpdated: new Date('2015-07-30T15:28:00+01:00'),
            datePublished: null,
          },
          {
            title: 'Touring the North',
            link: 'http://www.alexpringle.co.uk/touring-the-north.html',
            description:
              "It's been a long time since I last posted, a lot has happened but I've largely been touring The North™ on my bike. As usual there has been plenty of development action, however I'll leave that for future posts. I've also been to plenty of football matches, at the KC here in Hull, Old Trafford and of course the King Power Stadium back in Leicester. As summer approaches and university life comes to a close for good, I'm looking to continue the adventures accross the country, hopefully with some epic summer bike rides around the south.",
            imageUrl: 'http://www.alexpringle.co.uk/images/brid.jpg',
            dateUpdated: new Date('2015-05-07T14:38:00+01:00'),
            datePublished: null,
          },
          {
            title: 'End Of The Tour',
            link: 'http://www.alexpringle.co.uk/end-of-the-tour.html',
            description:
              "My tour of ‘The South’ finally came to a close as I left IBM in August. It's was a truly epic 14 months of nonstop friend making, code writing, landlord ranting, and train journeys. I’ve spent a large amount of time in London, seeing the sights, planning world domination and enjoying conference talks. I’ve also been out travelling as far as Bletchley Park and Watford, learning about Alan Turing and the somewhat less important (and fictional) Harry Potter. I’ve also once again spent a sizable number of summer evenings enjoying the company of my friend Rob in Fareham. Sunset in Winchester. My tour of 'The South' may be over, but I'll be back soon enough no doubt. More Photos",
            imageUrl: 'http://www.alexpringle.co.uk/images/IMG_20140815_081559.jpg',
            dateUpdated: new Date('2014-10-18T13:25:00+01:00'),
            datePublished: null,
          },
          {
            title: 'About 30 Minutes',
            link: 'http://www.alexpringle.co.uk/about-30-minutes.html',
            description:
              "In the past three years I've had some 'interesting' living experiences, with everything usually descending into madness. Crazy landlords, insane hazards and genuinely disturbing living conditions have all featured in my stories at the pub. Back in January I fled my last house, which was a good call. It's added about 30 minutes to my journey to and from work every day, however this is an hour filled with satisfaction. The photo above says it all, no trouble in sight.",
            imageUrl: 'http://www.alexpringle.co.uk/images/IMG_20140601_195851.png',
            dateUpdated: new Date('2014-06-14T11:00:00+01:00'),
            datePublished: null,
          },
          {
            title: 'Touring The South : Trains, Software Engineering & Friends',
            link:
              'http://www.alexpringle.co.uk/touring-the-south-trains-software-engineering-friends.html',
            description:
              'IBM Hursley - Hursley House I’m in the south, and while not being caught in record heat waves and storms I’ve been engineering software, on trains and hanging out with friends. Sometimes all three at once. The primary reason I’m in the south however, is that I’m working at IBM on work placement. It’s going really well, lots of challenging and interesting work with plenty of chances to learn and network. It’s great being in a environment densely packed with people who are passionate about software. Outside of work, I’ve spent an awful lot of time on trains. I’ve been to Fareham, Botley and numerous other places, visiting old and new friends. I seem to find myself eating very civilised meals with friend’s families around the south and visiting an awful lot of pubs.National Rail, despite it’s problems, has facilitated some awesome weekends. I’ve made a whole load of friends, and am positioned well to see some very good old friends during the holidays. Outings out in the south have been great, new people and new places are always the most exciting part of moving across the country. Side projects continue, several new popping up and a couple (slowly) closing. The thing I love most about side projects is working along side people who are passionate and smart, it makes the work even more rewarding. The south has provided even more people to collaborate with, which of course is awesome, especially when thinking about future plans. The tour continues.',
            imageUrl: 'http://www.alexpringle.co.uk/images/IMG_20130710_163544.png',
            dateUpdated: new Date('2013-11-09T21:45:00+00:00'),
            datePublished: null,
          },
        ];

        expect(await parseFeed(alexCustomFeedATOM)).toEqual(expectedItems);
      });

      it('should correctly parse wordpress.com.rss', async () => {
        const wordpressComRSS = readFileSync('./src/test-data/rss/wordpress.com.rss').toString();

        const expectedItems: IBlogPost[] = [
          {
            title: 'Graduating from York',
            link: 'https://dannycomputerscientist.wordpress.com/2016/02/05/graduating-from-york/',
            description:
              'On January 23rd I graduated with an MSc in Advanced Computer Science from The University of York. It was a nice occasion to get together and be merry with the family, and of course for some photos in my cap and gown — this time they were grey and blue. My parents took my degree',
            imageUrl: 'https://dannycomputerscientist.files.wordpress.com/2016/02/img_0091.jpg',
            datePublished: new Date('Fri, 05 Feb 2016 18:05:12 +0000'),
            dateUpdated: null,
          },
          {
            title: 'HackTrain 2.0',
            link: 'https://dannycomputerscientist.wordpress.com/2016/01/10/hacktrain-2-0/',
            description:
              'It seems like a lifetime ago, but the first HackTrain event was actually only 9 months ago — It probably feels so long ago to me as so much has change in the interim, including me getting a job as a result of the first event. When an opportunity came up to represent Trainline at',
            imageUrl:
              'https://dannycomputerscientist.files.wordpress.com/2015/12/12304083_786742814805282_703787864428458423_o.jpg',
            datePublished: new Date('Sun, 10 Jan 2016 22:01:22 +0000'),
            dateUpdated: null,
          },
          {
            title: 'Centre for Computing History',
            link:
              'https://dannycomputerscientist.wordpress.com/2016/01/10/centre-for-computing-history/',
            description:
              'Since September, Charlotte and I have lived about a minutes walk from the UK Computer Museum (which also seems to go by the name Centre for Computing History), but we’d never actually gone inside. Today after my flying lesson we went to have a quick look. Whilst it made me feel old to see things I',
            imageUrl: 'https://dannycomputerscientist.files.wordpress.com/2016/01/bbc-micro.jpg',
            datePublished: new Date('Sun, 10 Jan 2016 17:39:38 +0000'),
            dateUpdated: null,
          },
          {
            title: 'Tracking Moving Trains (with the minimum possible effort)',
            link:
              'https://dannycomputerscientist.wordpress.com/2015/12/22/tracking-moving-trains-with-minimum-possible-effort/',
            description:
              'Trains are, in many respects, wonderful machines. They’re simultaneously both the most romantic form of travel and the most grueling way to get to work every morning. One thing trains are not however, is up-to-date with modern technology. Whilst you can follow the course, in real time, of a plane soaring at 36,000 feet above',
            imageUrl:
              'https://dannycomputerscientist.files.wordpress.com/2015/12/12106848_1494412047526257_4658382875925199724_n.jpg',
            datePublished: new Date('Tue, 22 Dec 2015 01:52:55 +0000'),
            dateUpdated: null,
          },
          {
            title: 'Captain Danny',
            link: 'https://dannycomputerscientist.wordpress.com/2015/12/09/captain-danny/',
            description:
              'One of the nice things about working, opposed to studying, is that I now don’t feel guilty about not spending all my time working on coursework. Time for a hobby! Living 15 minutes walk from Cambridge Airport I quite often see people learning to fly, and thought it looked like fun — so decided to start',
            imageUrl: 'https://dannycomputerscientist.files.wordpress.com/2015/12/img_05611.jpg',
            datePublished: new Date('Wed, 09 Dec 2015 21:12:16 +0000'),
            dateUpdated: null,
          },
          {
            title: 'Trainline at Silicon Milkroundabout',
            link:
              'https://dannycomputerscientist.wordpress.com/2015/12/04/trainline-at-silicon-milkroundabout/',
            description:
              'A few weeks ago I was lucky enought to be part of the team that tried, and hopefully succeeded, to entice more developers to come and work with us at Trainline at the Silicon Milkroundabout tech recruitment event. I really enjoy talking to people about technology and it was especially nice to talk to people who',
            imageUrl: 'https://dannycomputerscientist.files.wordpress.com/2015/12/img_0521.jpg',
            datePublished: new Date('Fri, 04 Dec 2015 23:12:03 +0000'),
            dateUpdated: null,
          },
          {
            title: 'On-boarding at Trainline',
            link:
              'https://dannycomputerscientist.wordpress.com/2015/10/29/on-boarding-at-trainline/',
            description:
              'I’m now entering the sixth week of my time at Trainline. It’s been quite the experience, due to it being my first full-time job and it being a time of significant changes at Trainline in terms of technology, branding and even an expansion into the European rail market. It’s been great to be in a',
            imageUrl:
              'https://dannycomputerscientist.files.wordpress.com/2015/10/trainline-homepage.png',
            datePublished: new Date('Thu, 29 Oct 2015 17:57:27 +0000'),
            dateUpdated: null,
          },
          {
            title: 'MSc Finished',
            link: 'https://dannycomputerscientist.wordpress.com/2015/09/13/msc-finished/',
            description:
              'Last week I submitted my thesis, workshop report and conference presentation for my MSc in Advanced Computer Science. Two days after my submission I was also required to present my research and answer a few questions fielded from a lecturer in Yorks Department of Computer Science who had not previously seen my work. The',
            imageUrl: null,
            datePublished: new Date('Sun, 13 Sep 2015 01:13:58 +0000'),
            dateUpdated: null,
          },
          {
            title: 'Expect the unexpected',
            link: 'https://dannycomputerscientist.wordpress.com/2015/08/02/expect-the-unexpected/',
            description:
              'When you design software you usually have a few use cases in mind, in the case of EpsilonGit the use case I keep coming back to is a project lead who wants an overview of how his team is working and how they are using their version control software. Back in second year when I',
            imageUrl:
              'https://dannycomputerscientist.files.wordpress.com/2015/08/screen-shot-2015-08-02-at-21-16-29.png',
            datePublished: new Date('Sun, 02 Aug 2015 20:19:55 +0000'),
            dateUpdated: null,
          },
          {
            title: 'Thesis writing begins',
            link: 'https://dannycomputerscientist.wordpress.com/2015/07/27/thesis-writing-begins/',
            description:
              'Today I started work on my masters thesis covering my research for and development of EpsilonGit. There’s no template provided for the layout of such reports, so today I’ve been sketching out a rough outline of what I hope to include in the report. e.g. Chapter names, section headings and comments for things to talk',
            imageUrl:
              'https://dannycomputerscientist.files.wordpress.com/2015/07/screen-shot-2015-07-27-at-22-02-20.png',
            datePublished: new Date('Mon, 27 Jul 2015 21:13:14 +0000'),
            dateUpdated: null,
          },
        ];

        expect(await parseFeed(wordpressComRSS)).toEqual(expectedItems);
      });
    });
  });
});
