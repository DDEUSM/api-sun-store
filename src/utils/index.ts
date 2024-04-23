import { compressImages } from "../controllers/config/imageCompressor";
import env from "../env";

export function capitalizeWords(name: string)
{    
    return name.toLowerCase().split(' ').map((word : string) => 
    {
        let new_word = word[0].toUpperCase() + word.substring(1);
        return new_word;
    }).toString().replaceAll(',',' ');
}

export function adaptDateToDatabase(date: Date)
{    
    return date.toLocaleDateString("pt-br").replaceAll("/", "-")
}

export function imageUrlDestiny(inputPath: string, outputPath: string, file: any)
{
    const rawName = file?.filename.split(".")[0] as string;    
    const finalImageUrl = compressImages(inputPath, outputPath, rawName);
    const formatedUrl = (finalImageUrl.replaceAll("/", "\\")).replace("public\\", "")
    return `http://${env.HOST}:${env.PORT}\\${formatedUrl}`
}