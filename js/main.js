window.addEventListener( 'load', () => {
    const endpointEvolucion = 'https://pokeapi.co/api/v2/evolution-chain/'
    renderizandoPokemons( endpointEvolucion )
    // search()
    // input()
    buscador()
} )

// OBTENGO EL ENDPOINT DE LOS POKÉMONS SIN EVOLUCIONAR
function renderizandoPokemons( endpoint ) {
    
    fetch( endpoint )
    .then( res => {
        if ( !res.ok ) {
            throw new Error( `Error HTTP: ${res.status}` )
        }
        return res.json()
    } )
    .then( data => {
        const urls = data.results

        urls.forEach( url => {
            const endpoint = url.url
            obtenerPokemonPorEvolucion( endpoint )
            console.log( "MOSTRANDO ENDPOINT DE POKÉMONS" );
            console.log( endpoint );
        });
        
        console.log( "MOSTRANDO RENDERIZACIÓN DE POKÉMONS" );
        console.log( data );
        
    } )
    .catch( error => console.error( error ) )

}

// OBTENGO EL NOMBRE DE LOS POKÉMONS 
function obtenerPokemonPorEvolucion( endpoint ) {

    fetch( endpoint )
    .then( res => {
        if ( !res.ok ) {
            throw new Error( `Error HTTP: ${res.status}` )
        }
        return res.json()
    } )
    .then( data => {
        const name = data.chain.species.name
        obtenerDatosPokemon( name )
        console.log( "POKÉMON SIN EVOLUCIONAR" );
        console.log( data );
    } )
    .catch( error => console.error() )

}

// DATOS 
function obtenerDatosPokemon( nombrePokemon ) {

    const cards = document.querySelector( '#cards' );

    fetch( `https://pokeapi.co/api/v2/pokemon/${nombrePokemon}/` )
    .then( res => {
        if ( !res.ok ) {
            throw new Error( `Error HTTP: ${res.status}` )
        }
        return res.json()
    } )
    .then( data => {
        const imagen = data.sprites.other.dream_world.front_default;
        const types = data.types;
        let tipo = types.map( type => `<p class="card__type">${type.type.name}</p>` )
        tipo = tipo.join( "" );

        cards.innerHTML += `
            <div class="card">
                <div class="card__img">
                    <img class="card__img" src="${imagen}" alt="">
                </div>
                <h5 class="card__name">${nombrePokemon}</h5>
                <div class="card__types">
                    ${tipo}
                </div>
            </div>
        `
        
    } )
    .catch( error => console.error( error ) )

}

// BUSCADOR  
function buscador() {
    document.addEventListener( 'keyup', e => {
    const cardPokemons = document.querySelectorAll( '.card' )
        if ( e.target.matches( "#search" ) ) {
            const pokemons = document.querySelectorAll( '.card__name' );

            const textInput = e.target.value.toLowerCase();
            pokemons.forEach( ( name, i ) => {
                const nameCard = name.textContent.toLowerCase();

                if ( !nameCard.includes( textInput ) ) {
                    cardPokemons[ i ].classList.add( 'ocultar' )
                } else {
                    cardPokemons[ i ].classList.remove( 'ocultar' )
                }
            })
        }
        
    } )
}