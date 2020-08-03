<template>
  <div class="reserva-admin">
    <PageTitle icon="fa fa-users" main="Reserva" />
    <b-form>
      <input type="hidden" id="user-id" v-model="reserva.id" />
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Livro:" label-for="livro">
            <b-form-select v-model="newLivro.id">
              <option :value="null" disabled>Seleciona um Livro</option>
              <option
                v-for="livroReserva in livros"
                :key="livroReserva.titulo"
                :value="livroReserva.id"
              >{{ livroReserva.titulo }}</option>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="Cliente:" label-for="cliente">
            <b-form-select v-model="reserva.cliente.id">
              <option :value="null" disabled>Seleciona um cliente</option>
              <option
                v-for="clienteReserva in clientes"
                :key="clienteReserva.id"
                :value="clienteReserva.id"
              >{{ clienteReserva.nome }}</option>
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col xs="12">
          <b-button variant="success" v-if="mode === 'save'" @click="save">Reservar</b-button>
          <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
          <b-button class="ml-2" @click="reset">Cancelar</b-button>
          <b-button class="ml-2" variant="dark" @click="adicionarLivro">Adicionar livros</b-button>
        </b-col>
      </b-row>
    </b-form>
    <hr />
    <div>
      <b-table
        id="my-table"
        hover
        striped
        :bordered="true"
        :no-border-collapse="true"
        :fixed="true"
        :items="reserva.livros"
        :fields="fields"
        small
      >
        <template v-slot:cell(actions)="data">
          <b-button variant="danger" @click="removeLivro(data.item) ">
            <i class="fa fa-trash"></i>
          </b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle.vue";
import { showError, baseApiUrl } from "@/global";
import axios from "axios";

export default {
  name: "Reserva",
  components: { PageTitle },
  data() {
    return {
      mode: "save",
      clienteReserva: {},
      clientes: [],
      livroReserva: {},
      livros: [],
      newLivro: {
        id: null,
      },
      reserva: {
        cliente: {
          id: null,
        },
        livros: [],
      },
      fields: [
        {
          key: "id",
          label: "Livros",
          sortable: true,
          formatter: (value) => {
            return this.livros.find((l) => l.id == value)["titulo"];
          },
        },
        {
          key: "actions",
          label: "Ações",
        },
      ],
    };
  },
  methods: {
    loadLivros() {
      const url = `${baseApiUrl}/livros`;
      axios.get(url).then((res) => {
        this.livros = res.data.content;
      });
    },
    adicionarLivro() {
      this.reserva.livros.push(this.newLivro);
      this.newLivro = {
        id: null,
      };
    },
    reset() {
      (this.mode = "save"),
        (this.reserva = { livros: [], cliente: { id: null } });
    },
    save() {
      const method = this.reserva.id ? "put" : "post";
      const id = this.reserva.id ? `/${this.reserva.id}` : "";
      axios[method](`${baseApiUrl}/reservas${id}`, this.reserva)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const id = this.reserva.id;
      axios.delete(`${baseApiUrl}/reservas/${id}`).then(() => {
        this.$toasted.global.defaultSuccess();
        this.reset();
      });
    },
    linkGen(pageNum) {
      return pageNum === 1 ? "?" : `?page=${pageNum}`;
    },
    loadClientes() {
      const url = `${baseApiUrl}/clientes`;
      axios.get(url).then((res) => {
        this.clientes = res.data.content;
      });
    },
    removeLivro(value) {
      var arr = this.reserva.livros;
      var index = arr.indexOf(value);
      if (index > -1) {
        arr.splice(index, 1);
      }
      return arr;
    },
  },
  mounted() {
    this.loadLivros();
    this.loadClientes();
  },
};
</script>

<style>
</style>