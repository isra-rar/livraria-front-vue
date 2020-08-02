<template>
  <div class="Aluguel-admin">
    <PageTitle icon="fa fa-users" main="Aluguel" />
    <b-form>
      <input type="hidden" id="user-id" v-model="aluguel.id" />
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Livro:" label-for="livro">
            <b-form-select v-model="newLivro.id">
              <option :value="null" disabled>Seleciona um Livro</option>
              <option
                v-for="livroAluguel in livros"
                :key="livroAluguel.titulo"
                :value="livroAluguel.id"
              >{{ livroAluguel.titulo }}</option>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="Cliente:" label-for="cliente">
            <b-form-select v-model="aluguel.cliente.id">
              <option :value="null" disabled>Seleciona um cliente</option>
              <option
                v-for="clienteAluguel in clientes"
                :key="clienteAluguel.id"
                :value="clienteAluguel.id"
              >{{ clienteAluguel.nome }}</option>
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col xs="12">
          <b-button variant="success" v-if="mode === 'save'" @click="save">Alugar</b-button>
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
        :items="aluguel.livros"
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
  name: "Aluguel",
  components: { PageTitle },
  data() {
    return {
      mode: "save",
      clienteAluguel: {},
      clientes: [],
      livroAluguel: {},
      livros: [],
      newLivro: {
        id: null,
      },
      aluguel: {
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
          key: "id",
          label: "Valor",
          sortable: true,
          formatter: (value) => {
            return this.livros.find((l) => l.id == value)["valor"];
          }
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
      this.aluguel.livros.push(this.newLivro);
      this.newLivro = {
        id: null,
      };
    },
    reset(){
      (this.mode = "save"),
      (this.aluguel = { livros: [], cliente: { id: null } });
    },
    save() {
      const method = this.aluguel.id ? "put" : "post";
      const id = this.aluguel.id ? `/${this.aluguel.id}` : "";
      axios[method](`${baseApiUrl}/alugueis${id}`, this.aluguel)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const id = this.aluguel.id;
      axios.delete(`${baseApiUrl}/alugueis/${id}`).then(() => {
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
      var arr = this.aluguel.livros;
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