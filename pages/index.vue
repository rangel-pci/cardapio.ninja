<script setup lang="ts">
  const runtimeConfig = useRuntimeConfig()
  const APP_NAME = runtimeConfig.public.appName
</script>

<template>
  <div class="bg-gray-100 overflow-hidden" id="inicio">
    <header class="mx-auto bg-white lg:fixed top-0 left-0 w-full z-10 shadow-md text-sm">
      <nav id="nav" class="mx-auto flex justify-between px-4 main-container">
        <a href="/" class="py-3">
          <NuxtImg src="/img/logo/logo-no-background.svg" class="w-[150px] md:w-[230px]" :alt="APP_NAME + ' logo'"
            :title="APP_NAME"/>
        </a>
        <div class="flex align-items-center font-medium lg:hidden">
          <NuxtLink :to="{ path: '/app/login' }" class="my-auto ">
            <button class="font-medium text-white bg-[#6C5CE7] p-2 rounded-sm">
              Login ->
            </button>
          </NuxtLink>
        </div>

        <ul class="justify-center hidden lg:flex">
          <li class="flex text-center">
            <a class="flex align-items-center font-medium hover:text-[#6C5CE7] px-8" href="#como-funciona">
              <span class="my-auto">Como Funciona</span>
            </a>
          </li>
          <li class="flex text-center">
            <a class="flex align-items-center font-medium hover:text-[#6C5CE7] px-8" href="#vantagens-e-preços">
              <span class="my-auto">Vantagens</span>
            </a>
          </li>
          <li class="flex text-center">
            <a class="flex align-items-center font-medium hover:text-[#6C5CE7] px-8" href="#vantagens-e-preços">
              <span class="my-auto">Preços</span>
            </a>
          </li>
          <li class="flex text-center">
            <NuxtLink :to="{ path: '/app/login' }" class="flex align-items-center font-medium hover:text-[#6C5CE7] px-8">
              <span class="my-auto"><u>Login</u></span>
            </NuxtLink>
          </li>
          <li class="flex text-center w-1/4 ml-8">
            <NuxtLink :to="{ path: '/app/cadastro' }"
              class="flex align-items-center font-medium  px-8 py-2 
              text-white bg-gradient-to-br from-[#6C5CE7] to-[#55EFC4] transition-all hover:shadow-lg hover:shadow-cyan-300">
              <span class="my-auto">
                <div class="text-white mt-2 animate-bounce inline-block">🔥</div> Quero criar meu cardápio
                digital agora gratuitamente!
              </span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <main class="bg-white lg:bg-inherit">
      <div class="flex lg:mt-20 pt-2 lg:hidden">
        <NuxtLink :to="{ path: '/app/cadastro' }" class="flex-1 align-items-center font-medium  px-8 py-4
        text-white text-center bg-gradient-to-br from-[#6C5CE7] to-[#55EFC4] transition-all hover:shadow-lg hover:shadow-cyan-300"
          >
          <div class="mt-2 animate-bounce inline-block">👉</div><span class="text-xl"> Clique aqui para criar seu
            cardápio digital agora gratuitamente!</span>
          </NuxtLink>
      </div>

      <div class="pt-2 lg:pt-40 lg:min-h-screen">
        <div
          class="bg-white px-4 py-8 lg:p-8 rounded flex flex-col lg:flex-row lg:h-[550px] mx-auto main-container relative">
          <div class="my-auto lg:w-6/12">
            <h1 class="font-bold text-2xl lg:text-5xl text-center lg:text-left">Digitalize seu cardápio com
              facilidade e destaque-se online</h1>
            <p class="mt-4 lg:text-lg  text-center lg:text-left lg:w-3/4 mb-8">Expanda seu alcance e receba
              pedidos pelo <span class="text-green-600">WhatsApp</span> com um cardápio online eficiente e sem
              complicações.</p>

            <a href="/reidachapa" target="_blank">
              <div class="bg-[#6C5CE7] text-white w-fit py-4 px-8 rounded animate-bounce text-lg mx-auto lg:mx-0">
                Acessar demonstração (Rei da Chapa)
              </div>
            </a>
          </div>
          <div>
            <NuxtImg src="/img/web/demos.png" class="lg:hidden mt-8 w-auto mx-auto" alt="Demonstração do cardápio online"
              title="Demonstração do cardápio.ninja" />
          </div>
          <div class="relative">
            <img src="/img/web/demos.png"
              class="absolute hidden lg:block top-0 left-0 w-auto h-auto max-w-[720px]" alt="Demonstração do cardápio online"
              title="Demonstração do cardápio.ninja"/>
          </div>
        </div>
      </div>

      <section class="py-16 px-4 mx-auto main-container bg-white rounded" id="como-funciona">
        <h2 class="mb-8 text-center text-2xl font-semibold text-gray-600">Como Funciona</h2>
        <div class="px-8 lg:px-0 grid grid-flow-row lg:grid-flow-col lg:grid-cols-4 gap-4 lg:gap-2 pt-4 text-center">
          <NuxtLink :to="{ path: '/app/cadastro' }"
            class="group flex flex-col px-2 py-4 rounded bg-gradient-to-br from-[#6C5CE7] to-[#6C5CE7] transition-all hover:to-[#55EFC4]">
            <div class="flex-1 flex items-center justify-center max-h-[255px]">
              <NuxtImg src="/img/web/register-3d.png" class="h-44 lg:h-auto" alt="Cadastro"/>
            </div>
            <p class="text-white">Comece criando uma conta.</p>
            <span class="text-white mt-2 animate-ping">-></span>
          </NuxtLink>
          <div class="border rounded lg:shadow-none flex flex-col px-2 py-4">
            <div class="flex-1 flex items-center justify-center max-h-[255px]">
              <NuxtImg src="/img/web/creation-3d.png" class="h-44 lg:h-auto" alt="Criação"/>
            </div>
            <p>Adicione as informações do seu negócio como nome e ramo de atividade.</p>
          </div>
          <div class="border rounded lg:shadow-none flex flex-col px-2 py-4">
            <div class="flex-1 flex items-center justify-center max-h-[255px]">
              <NuxtImg class="my-auto h-44 lg:h-auto" src="/img/web/items-3d.png" alt="Personalização"/>
            </div>
            <p>Adicione produtos ou serviços e personalize de acordo com o seu estilo.</p>
          </div>
          <div class="border rounded lg:shadow-none flex flex-col px-2 py-4">
            <div class="flex-1 flex items-center justify-center max-h-[255px]">
              <p class="font-extrabold text-2xl mb-4 lg:mb-0">🚀 Pronto!</p>
            </div>
            <p>Compartilhe seu link ou QR Code e comece a receber pedidos no <span class="text-green-600">WhatsApp</span>!
            </p>
          </div>
        </div>
      </section>

      <svg class="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path class="fill-[#f7f7f7] md:fill-white" fill-opacity="1"
          d="M0,160L34.3,138.7C68.6,117,137,75,206,74.7C274.3,75,343,117,411,133.3C480,149,549,139,617,149.3C685.7,160,754,192,823,202.7C891.4,213,960,203,1029,181.3C1097.1,160,1166,128,1234,117.3C1302.9,107,1371,117,1406,122.7L1440,128L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z">
        </path>
      </svg>
      <section class="pb-16 px-4 bg-[#f7f7f7] md:bg-white h-100" id="vantagens-e-preços">
        <div class="main-container mx-auto">
          <h2 class="mb-8 text-center text-2xl font-semibold text-gray-600">Vantagens e Preços</h2>
          <div class="grid lg:grid-flow-row lg:grid-cols-3 lg:grid-rows-1 gap-2 pt-4">
            <div class="p-2">
              <div class="flex items-center lg:flex-col lg:text-center lg:justify-center gap-2">
                <NuxtImg src="/img/web/money.png" alt="Econômico" class="w-12"/>
                <div>
                  <p class="text-sm">Economize dinheiro anunciando seus produtos gratuitamente para todo o
                    Brasil.</p>
                </div>
              </div>
            </div>
            <div class="p-2">
              <div class="flex items-center lg:flex-col lg:text-center lg:justify-center gap-2">
                <NuxtImg src="/img/web/settings.png" alt="Econômico" class="w-12"/>
                <div>
                  <p class="text-sm">Tenha total controle sobre seu cardápio. Adicione, edite e remova
                    itens de forma rápida e eficiente.</p>
                </div>
              </div>
            </div>
            <div class="p-2">
              <div class="flex items-center lg:flex-col lg:text-center lg:justify-center gap-2">
                <NuxtImg src="/img/web/deadline.png" alt="Econômico" class="w-12"/>
                <div>
                  <p class="text-sm">Seus clientes podem montar pedidos pela página e enviá-los pelo <span
                      class="text-green-600">WhatsApp</span>, com todas as informações necessárias.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="p-2 mt-16 lg:mt-28 lg:mb-16 grid md:grid-flow-col md:grid-cols-3 gap-4 opacity-80">
            <div class="py-4 px-8 flex flex-col justify-center rounded shadow-xl w-full border bg-white">
              <div class="flex gap-1">
                <WebStarIcon :fill="true"/>
                <WebStarIcon :fill="true"/>
                <WebStarIcon :fill="true"/>
                <WebStarIcon :fill="true"/>
                <WebStarIcon />
              </div>
              <p class="font-medium text-sm mt-2">Ótima plataforma para quem trabalha com Fast-food</p>
            </div>
            <div class="py-4 px-8 flex flex-col justify-center rounded shadow-xl w-full border bg-white">
              <div class="flex gap-1">
                <WebStarIcon :fill="true"/>
                <WebStarIcon :fill="true"/>
                <WebStarIcon :fill="true"/>
                <WebStarIcon :fill="true"/>
                <WebStarIcon />
              </div>
              <p class="font-medium text-sm mt-2">Adorei criar meu cardápio aqui</p>
            </div>
            <div class="py-4 px-8 flex flex-col justify-center rounded shadow-xl w-full border bg-white">
              <div class="flex gap-1">
                <WebStarIcon :fill="true"/>
                <WebStarIcon :fill="true"/>
                <WebStarIcon :fill="true"/>
                <WebStarIcon :fill="true"/>
                <WebStarIcon />
              </div>
              <p class="font-medium text-sm mt-2">Gostaria de mais modelos de design, mas ainda assim é útil para criar cardápios</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="bg-[#6C5CE7]">
      <div class="mx-auto">
        <div class="text-center text-[11px] lg:text-sm p-1 text-white">
          &copy; {{ new Date().getFullYear() }} Cardápio.ninja
        </div>
      </div>
    </footer>
  </div>
</template>
  