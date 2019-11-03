const rp = require('request-promise');
const $ = require('cheerio');

const url = 'https://www.finn.no/realestate/homes/search.html?q=pernillevegen';
let adresser = [];
let adressenumre = []
let adresseResultat = []
let prisogM2 = []
let urlResult = []
let intervallFraOgMed = 4;
let intervallTilOgMed = 23;

function henteValgteAdresser(callback) {
    rp(url)
        .then(function (html) {
            hentOnskedeAdresser(html)
            hentOnsketIntervall()
            hentPrisOgM2(html)
            hentUrl(html)
            // justTheNumbers();
            // intervall();

            //hentPris(html);
            //hentUrl(html);
            //removeLineBreaks();
            //onlyTheRightOnes();
            //RightOnesCleaned();
            //WrapItTogether()

            callback()
            // endResult()
        });
}
//Dette er utgangspunktet. Har her søkt opp alle adresser i f.eks "sandviken", eller "morvikbotn" , "pernilleveien" etc.
function hentOnskedeAdresser(html){
    $('.ads__unit__content__details>span', html).each(function (i) {
        //Hent text fra cheerio
        let text = $(this).text();
        //Hvis [i] er udefinert, lag objekt i tabell
        if (adresser[i] === undefined) {
            adresser[i] = {};
        }
        //Oppdater tilSalgs property av objektet med text value
        adresser[i] = text;
    });
}

//Fjerner alt utenom adressenumre, parser dem, og sjekker dem opp mot intervallet man har satt. Resultatet legges i en tabell
function hentOnsketIntervall() {
    let i;
    let j=0;
    for (i = 0; i < adresser.length; i++) {
        adressenumre[i] = adresser[i].replace(/\D/g, '');
        adressenumre[i] = parseInt(adressenumre[i], 10)

        //setter adresseintverall og legger dem som er gyldige inn i tabell
        if ((adressenumre[i] >= intervallFraOgMed && adressenumre[i] <= intervallTilOgMed) || isNaN(adressenumre[i])) {
            adresseResultat.push(adresser[i])
            //storeIntervalHitsPos[i] = [i]
            //result[j] = storeAdress[i]
            //j++
        }
    }
    }
//Denne funksjonen henter pris og m2
function hentPrisOgM2(html) {
    let j=0;
    $('.ads__unit__content__keys', html).each(function (i) {
        //Hent text fra cheerio
        let text = $(this).text();
        //Hvis [i] er udefinert, lag objekt i tabell


        if (prisogM2[i] === undefined && (adressenumre[i] >= intervallFraOgMed && adressenumre[i] <= intervallTilOgMed) || isNaN(adressenumre[i])) {
            prisogM2[j] = {};

        //Oppdater tilSalgs property av objektet med text value
        prisogM2[j] = text;
        j++
    }
        //Fjerne unødvendig innhold
        for (i = 0; i < prisogM2.length; i++) {
            //Regex Gjelder for linebreaks representert på windows, linux og apple
            prisogM2[i] = prisogM2[i].replace(/(\r\n|\n|\r)/gm, '');
        }
        for (i = 0; i < prisogM2.length; i++) {
            //Regex Gjelder for fjerning av unødvendig mange mellomrom
            prisogM2[i] = prisogM2[i].replace(/  +/g, ' ');
        }
    });


}

//Henter urlene for adressene, og legger de som er gydlige ijnn i tabell
function hentUrl(html){

    $('.ads__unit__link', html).each( function () {
        let link = $(this).attr('href');
        let j = 0;
        for (i = 0; i < adresser.length; i++) {

            //setter adresseintverall og legger dem som er gyldige inn i tabell
            if ((adressenumre[i] >= intervallFraOgMed && adressenumre[i] <= intervallTilOgMed) || isNaN(adressenumre[i])) {
                urlResult[j] = ("finn.no" + link);
                j++;
            }
        }

    });

}






    function kjorScript() {
        henteValgteAdresser(function () {
           // console.log(adresser)
           // console.log(adressenumre)
           // console.log(adresseResultat)
            //console.log(prisogM2)
         //console.log(urlResult)

            let Resultout = {};
            for (let i=0; i< adresseResultat.length; i++){
                Resultout [adresseResultat[i]] = {
                prisogM2: prisogM2[i],
                link: urlResult[i]
            }
            }
            console.log("==================Oppsummering===========================")
            console.log("Av "+adresser.length+" eiendommer/boliger var "+adresseResultat.length+" innenfor intervallet")
            console.log(((adresseResultat.length/adresser.length)*100).toFixed(2)+" % er beholdt")
            console.log("==================RESULTAT===========================")

        console.log(Resultout)
        })
        }
        kjorScript()