/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
import merge from 'merge-img';
import Jimp from 'jimp';

const pageDown = async ( page ) => {
    const isEnd = await page.evaluate( () => {
        window.scrollBy( 0, window.innerHeight );
        return window.scrollY >= document.documentElement.scrollHeight - window.innerHeight;
    } );

    return isEnd;
};

const fullPageScreenshot = async ( page, options = {}, quality = 100) => {
    const { pagesCount, extraPixels, viewport } = await page.evaluate( () => {
        window.scrollTo( 0, 0 );
        const pageHeight = document.documentElement.scrollHeight;
        return {
            pagesCount: Math.ceil( pageHeight / window.innerHeight ),
            extraPixels: pageHeight % window.innerHeight * window.devicePixelRatio,
            viewport: { height: window.innerHeight * window.devicePixelRatio, width: window.innerWidth * window.devicePixelRatio },
        };
    } );

    const images = [];
    for ( let index = 0; index < pagesCount; index += 1 ) {
        if ( options.delay ) {
            await page.waitFor( options.delay );
        }
        if (options.type === underfined) options.type = "jpeg";
        const image = await page.screenshot( { type: options.type, quality, fullPage: false } );
        await pageDown( page );
        images.push( image );
    }

    if ( pagesCount === 1 ) {
        const image = await Jimp.read( images[0] );
        if ( options.path ) image.write( options.path );
        return image;
    }
    // crop last image extra pixels
    const cropped = await Jimp.read( images.pop() )
        .then( image => image.crop( 0, viewport.height - extraPixels, viewport.width, extraPixels ) )
        .then( image => image.getBufferAsync( Jimp.AUTO ) );

    images.push( cropped );
    const mergedImage = await merge( images, { direction: true } );
 
    if (options.path) {
        await new Promise((resolve, reject) => {
          mergedImage.write(options.path, () => {
            resolve();
          });
        });
    };
    
    return mergedImage;
};

export default fullPageScreenshot;
