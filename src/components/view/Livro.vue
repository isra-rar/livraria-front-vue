<template>
  <div class="livro-admin">
    <PageTitle icon="fa fa-users" main="Livro" />
    <b-form>
      <input type="hidden" id="user-id" v-model="livro.id" />
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Titulo:" label-for="livro-titulo">
            <b-form-input
              id="titulo"
              type="text"
              v-model="livro.titulo"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o titulo"
            />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="Categoria" label-for="livro-categoria">
            <b-form-select v-model="livro.categoria" :options="categorias">
              <option :value="null" disabled>Selecione uma Categoria</option>
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Quantidade" label-for="livro-email">
            <b-form-input
              id="quantidade"
              type="number"
              v-model.number="livro.quantidade"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe a quantidade"
            />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="Valor Livro" label-for="livro-valor">
            <b-form-input
              id="valor"
              type="number"
              step="0.01"
              v-model.number="livro.valor"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o valor do Livro"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Autor" label-for="livro-autor">
            <b-form-input
              id="autor"
              type="text"
              v-model="livro.autor.nome"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o valor do Livro"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col xs="12">
          <b-button variant="success" v-if="mode === 'save'" @click="save">Salvar</b-button>
          <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
          <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-col>
      </b-row>
    </b-form>
    <hr />
    <div>
      <Table
        :items="livros"
        :fields="fields"
        :current-page="pagina"
        :perPage="qtnpagina"
        :loadData="laodCliente"
      />
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle.vue";
import { showError, baseApiUrl } from "@/global";
import axios from "axios";
import Table from "../template/Table";

export default {
  name: "Cliente",
  components: { Table, PageTitle },
  data() {
    return {
      pagina: 1,
      qtnpagina: 10,
      mode: "save",
      livro: {
        categoria: null,
        autor: {},
      },
      livros: [],
      categorias: [
        { value: "AÇÃO", text: "ACAO" },
        { value: "TERROR", text: "TERROR" },
        { value: "ROMANCE", text: "ROMANCE" },
        { value: "DRAMA", text: "DRAMA" },
        { value: "FICÇCÃO", text: "FICCAO" },
      ],
      fields: [
        {
          key: "id",
          label: "Código",
          sortable: true,
        },
        {
          key: "titulo",
          label: "Titulo",
          sortable: true,
        },
        {
          key: "categoria",
          label: "Categoria",
          sortable: true,
        },
        {
          key: "quantidade",
          label: "Quantidade",
          sortable: true,
        },
        {
          key: "valor",
          label: "Valor",
          sortable: true,
        },
        {
          key: "autor.nome",
          label: "Autor",
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
      const url = `${baseApiUrl}/livros`;
      axios.get(url).then((res) => {
        this.livros = res.data.content;
      });
    },
    reset() {
      (this.mode = "save"),
        (this.livro = { categoria: null, autor: {}}),
        this.loadData();
    },
    save() {
      const method = this.livro.id ? "put" : "post";
      const id = this.livro.id ? `/${this.livro.id}` : "";
      axios[method](`${baseApiUrl}/livros${id}`, this.livro)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const id = this.livro.id;
      axios.delete(`${baseApiUrl}/livros/${id}`).then(() => {
        this.$toasted.global.defaultSuccess();
        this.reset();
      });
    },
    linkGen(pageNum) {
      return pageNum === 1 ? "?" : `?page=${pageNum}`;
    },
    laodCliente(livro, mode = "save") {
      this.mode = mode;
      this.livro = { ...livro };
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style>
</style>