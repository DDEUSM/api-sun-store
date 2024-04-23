import Axios from "axios"
import env from "../env"

describe("ad tests", () => 
{
    const url = "http://"+env.HOST+":"+env.PORT
    test("get an ad by id", async () => 
    {
        const ad = {
            address: {
              street: 'Rua Grove Street',
              number: 500,
              neighborhood: 'Los Santos',
              zipcode: '13300-560',
              city: 'Jundiaí',
              state: 'São Paulo'
            },
            category: { sub_category: { name: 'Mobile' }, name: 'Tecnologias' },
            url_image: [],
            _id: '64651306beee2c2ec4d46033',
            date_created: '2021-05-17',
            description: 'Se trata de um dos smartphones mais tecnológicos da linha de iPhones, uma máquina de performance.',
            id_user_creator: '64cd99f8eeb161e2df4420f6',
            likes: 9,
            price: 10800,
            price_negotiable: true,
            status: true,
            title: 'iPhone 13 Pro Max',
            views: 0,            
        }
        const result = await Axios.get(url+"/ad/"+ad._id)        
        .catch((error) => {return console.log(error), error})

        expect(result.data.result_ads._id).toBe(ad._id)
        expect(result.data.result_ads.address.street).toBe(ad.address.street)
        expect(result.data.result_ads.id_user_creator).toBe(ad.id_user_creator)
    })

    test("search with filters", async () => 
    {
        const result: any = await Axios.get(url+"/search/Todos/empty/empty?order=most-recent-first")
        .catch(error => console.log(error))

        expect(result.data.length).toBeTruthy()
    })

    test("search with filters #2", async () => 
    {
        const result: any = await Axios.get(url+"/search/Todos/empty/empty?order=low-price-first")
        .catch(error => console.log(error))

        expect(result.data.length).toBeTruthy()
    })
})