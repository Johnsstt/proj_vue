import Qs from 'qs'

export default{
    transformRequest: [function (data) {

        data = Qs.stringify({});

        return data;
    }],

    transformResponse: [function (data) {

        return data;

    }],


    params: {},


    data: {},


    timeout: 10000,


    responseType: 'json', // default


}