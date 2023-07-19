window.addEventListener( 'load', () => {
    const nombre = JSON.parse(localStorage.getItem( "nombre" ))
    obteniendoEndpointEvolucion( nombre )

    const regresar = document.querySelector( '.render' );
    console.log( regresar );
    regresar.addEventListener( 'click', renderIndex )
    // regresar.addEventListener( 'click', () => {
    //     location.replace( './index.html' )
    // } )

} )

function obteniendoEndpointEvolucion( nombre ) {
    const endpoint = `https://pokeapi.co/api/v2/pokemon-species/${nombre}`

    fetch( endpoint )
    .then( res => {

        if ( !res.ok ) {
            throw new Error( `ERROR HTTP: ${res.status}` )
        }

        return res.json()
    } )
    .then( data => {

        const endpointEvolution = data.evolution_chain.url;
        renderizarEvolucion( endpointEvolution )
    } ) 
    .catch( error => console.error( error ) )
}

function renderizarEvolucion( endpoint ) {

    fetch( endpoint )
    .then( res => {

        if ( !res.ok ) {
            throw new Error( `ERROR HTTP: ${res.status}` )
        }

        return res.json()
    } )
    .then( data => {
        let evoluciones = data.chain.evolves_to
        const name = data.chain.species.name
        // const evolucionesEevee = data.chain.evolves_to.evolution_details
        console.log( evoluciones );
        pokemon( name, 1 )
        console.log( evoluciones );

        if ( evoluciones.length > 0 ) {

            evoluciones.forEach( ( evol, i )  => {
                let nombrePrimeraEvol = evol.species.name;
                i = 1
                const id = i + 1
                pokemon( nombrePrimeraEvol, id )

                let masEvols = evol.evolves_to
                if ( masEvols.length > 0 ) {
                    masEvols.forEach( ( masEvol, j ) => {
                        const idNuevo = id + ( j + 1 )
                        let nombreSegundaEvol = masEvol.species.name
                        pokemon( nombreSegundaEvol, idNuevo );
                    }  )
                }

            } )
        }
    } )
    .catch( error => console.error( error ) )
}

function pokemon( name, id ) {
    const cards = document.querySelector( '#cards' );
    const endpoint = 'https://pokeapi.co/api/v2/pokemon/'

    fetch( `${endpoint}${name}` )
    .then( res => {
        if ( !res.ok ) {
            throw new Error( `Error HTTP: ${res.status}` )
        }
        return res.json()
    } )
    .then( data => {
        console.log( "Pokemons" );
        console.log( data );
        const imagen = data.sprites.other.dream_world.front_default;
        const nombrePokemon = data.name

        const types = data.types;
        let tipo = types.map( type => `<p class="card__type">${type.type.name}</p>` )
        tipo = tipo.join( "" );

        cards.innerHTML += `
            <article class="card" id=${id}>
                <div class="card__img">
                    <img class="card__img" src="${imagen}" alt="">
                </div>
                <h5 class="card__name">${nombrePokemon}</h5>
                <div class="card__types">
                    ${tipo}
                </div>
            </article>
        `
    } )
    .catch( error => console.error( error ) )

}

function renderIndex() {
    location.replace( './index.html' )
}