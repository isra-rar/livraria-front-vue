<template>
  <div class="home">
    <PageTitle icon="fa fa-home" main="Dashboard" sub="Livraria Dados" />
    <div class="stats">
      <Stat
        title="Total de Livros Alugados"
        :value="stat.receitasEmitidas"
        icon="fa fa-book"
        color="#3bc480"
      />
      <Stat
        title="Total de Livros Reservados"
        :value="stat.receitasEmitidas"
        icon="fa fa-book"
        color="#3bc480"
      />
      <Stat
        title="Faturamento Total"
        :value="stat.atetadosEmitidos"
        icon="fa fa-money"
        color="#3bc480"
      />
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle.vue";
import Stat from "./Stat.vue";
import axios from "axios";
import { baseApiUrl } from "@/global";

export default {
  name: "Home",
  components: {
    PageTitle,
    Stat
  },
  data() {
    return {
      stat: {
        atetadosEmitidos: "",
        receitasEmitidas: ""
      }
    };
  },
  methods: {
    getAtestados() {
      axios
        .get(`${baseApiUrl}/atestados/totalAtestados`)
        .then(res => (this.stat.atetadosEmitidos = res.data));
    },
    getReceitas() {
      axios
        .get(`${baseApiUrl}/receitas/totalReceitas`)
        .then(res => (this.stat.receitasEmitidas = res.data));
    }
  },
  mounted() {
    this.getAtestados();
    this.getReceitas();
  }
};
</script>

<style>
.stats {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>