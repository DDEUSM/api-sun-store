export function capitalizeWords(name: string)
{    
    return name.toLowerCase().split(' ').map((word : string) => 
    {
        let new_word = word[0].toUpperCase() + word.substring(1);
        return new_word;
    }).toString().replaceAll(',',' ');
}

export function adaptDateToDatabase(date: string)
{    
    return new Date(date).toLocaleDateString("pt-br").replaceAll("/", "-")
}