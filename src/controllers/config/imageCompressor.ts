import fs from 'fs';
const compress = require('compress-images');

export function compressImages(inputPath: string, outputPath: string, filename: string)
{
    compress (
        inputPath, 
        outputPath, 
        { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "webp", command: ['-q', '60'] } },
        { png: { engine: "webp", command: ['-q', '60'] } },
        { svg: { engine: false, command: false } },
        { gif: { engine: false, command: false } },
        function (error: any, completed: any, statistic: any)
        {
            console.log("-------------");
            console.log(error);
            console.log(completed);
            console.log(statistic);
            console.log("-------------");
            /*
            try 
            {
                fs.unlinkSync(inputPath)    
            }             
            catch (error) 
            {
                throw new Error;
            }
            */
        }
    )

    return outputPath+filename+".webp"
}