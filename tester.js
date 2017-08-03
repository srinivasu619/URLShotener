var regex = /(http:|https:)\/\/(www.|)[a-zA-Z0-9]+\.\w+/;

function validURL(testurl)
{
    return regex.test(testurl);
}

module.exports ={validURL};