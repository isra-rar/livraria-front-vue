<template>
  <div class="retirar-admin">
    <PageTitle icon="fa fa-users" main="Retirar" />
    <div class="overflow-auto">
      <b-table
        id="my-table"
        hover
        striped
        :bordered="true"
        :no-border-collapse="true"
        :fixed="true"
        :items="reservas"
        :fields="fields"
        :per-page="perPage"
        :current-page="currentPage"
        small
      >
        <template v-slot:cell(actions)="data">
          <b-button variant="warning" @click="loadData(data.item)" class="mr-2">
            <i class="fa fa-pencil"></i>
          </b-button>
          <b-button variant="danger" @click="loadDataRemove(data.item) ">
            <i class="fa fa-trash"></i>
          </b-button>
        </template>
      </b-table>

      <hr />

      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
      ></b-pagination>

      <p class="mt-3">Current Page: {{ currentPage }}</p>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle.vue";
import { baseApiUrl } from "@/global";
import axios from "axios";

export default {
  name: "Retirar",
  components: { PageTitle },
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      mode: "save",
      reserva: {
        cliente: {
          id: null,
        },
        livros: [],
      },
      reservas: [],
      fields: [
        {
          key: "id",
          label: "Código",
          sortable: true,
        },
        {
          key: "cliente.nome",
          label: "Cliente",
          sortable: true,
        },
        {
          key: "valorTotal",
          label: "Valor Total",
          sortable: true,
        },
        {
          key: "diaReserva",
          label: "Dia Reservado",
          sortable: true,
        },
        {
          key: "retirado",
          label: "Retirado",
          sortable: true,
        },
        {
          key: "actions",
          label: "Ações",
        },
      ],
    };
  },
  methods: {
    loadData() {
      const url = `${baseApiUrl}/reservas`;
      axios.get(url).then((res) => {
        this.reservas = res.data.content;
        this.retirarReserva(this.reserva.id);
      });
    },
    loadDataRemove() {
      const url = `${baseApiUrl}/reservas`;
      axios.get(url).then((res) => {
        this.reservas = res.data.content;
        this.remove(this.reserva.id);
      });
    },
    retirarReserva(id) {
      const url = `${baseApiUrl}/reservas/retirar/${id}`;
      axios.get(url).then(() => {});
    },
    remove(id) {
      axios.delete(`${baseApiUrl}/reservas/${id}`).then(() => {
        this.$toasted.global.defaultSuccess();
      });
    },
    linkGen(pageNum) {
      return pageNum === 1 ? "?" : `?page=${pageNum}`;
    },
  },
  loadReserva(reserva) {
    this.reserva = { ...reserva };
  },
  mounted() {
    this.loadData();
  },
  computed: {
    rows() {
      return this.reservas.length;
    },
  },
};
</script>

<style>
</style>