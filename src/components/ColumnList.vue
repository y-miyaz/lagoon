<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column wrap>
        <v-text-field label="table name" v-model="table_name"></v-text-field>
        <v-btn fab dark color="indigo">
          <v-icon dark @click="add_column">add</v-icon>
        </v-btn>
        <div v-for="column in column_list" :key="column.key">
          <v-layout row justify-space-bet>
            <v-flex xs12 sm2 d-flex>
              <v-text-field
                label="column name"
                v-model="column.column_name"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm2 d-flex>
              <v-select
                :items="data_types"
                v-model="column.data_type"
                v-on="update_data_type"
                label="data type"
                class="px-10"
              ></v-select>
            </v-flex>
            <v-flex xs12 sm2 d-flex>
              <v-select
                :items="gen_types"
                v-model="column.gen_type"
                label="output type"
                class="px-10"
              ></v-select>
            </v-flex>
            <v-flex xs12 sm2 d-flex>
              <v-select
                :items="collection"
                v-model="column.collection"
                v-on="update_collection"
                label="collection"
                class="px-10"
              ></v-select>
            </v-flex>
            <v-flex v-if="column.collection === 'select'" d-flex>
              <v-combobox
                :items="collection_items"
                label="multiple select"
                multiple
                small-chips
              ></v-combobox>
            </v-flex>
            <v-flex v-if="column.collection === 'range'">
              <v-text-field
                label="number of times"
                v-model="column.num_of_times"
              ></v-text-field>
            </v-flex>
            <v-flex v-if="column.collection === 'range'">
              <v-text-field label="min" v-model="column.min"></v-text-field>
            </v-flex>
            <v-flex v-if="column.collection === 'range'">
              <v-text-field label="max" v-model="column.max"></v-text-field>
            </v-flex>
            <!-- <v-checkbox label="not null" v-model="column.not_null"></v-checkbox>
            <v-checkbox label="primary key" v-model="column.primary_key"></v-checkbox>-->
            <v-btn fab dark color="indigo">
              <v-icon dark :id="key" @click="delete_column(column.idx)"
                >delete</v-icon
              >
            </v-btn>
          </v-layout>
        </div>
        <v-text-field
          label="output data num"
          v-model="output_num"
        ></v-text-field>
        <v-layout justify-end>
          <v-flex xs2>
            <v-btn fab dark color="indigo">
              <v-icon dark v-on:click="generate_sql_file"
                >arrow_downward</v-icon
              >
            </v-btn>
          </v-flex>
        </v-layout>
        <div v-for="column in column_list" :key="column.key"></div>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  name: "column-list",
  data: function() {
    return {
      table_name: "",
      column_list: [],
      data_types: ["integer", "varchar", "boolean", "blob", "timestamp"],
      gen_types: ["incremental", "random"],
      collection: ["range", "select"],
      output_num: 100,
      output_data: [],
      idx_gen: 1
    };
  },
  methods: {
    //カラムを追加する
    add_column: function() {
      console.log(this.data_types);
      this.column_list.push({
        idx: this.idx_gen,
        column_name: "",
        data_type: "integer",
        gen_type: "incremental",
        collection: "range",
        num_of_times: 1,
        min: "1",
        max: "100",
        not_null: false,
        primary_key: false,
        selection_items: []
      });
      this.idx_gen++;
      console.log(this.column_list.length);
    },
    //カラムを削除する
    delete_column: function(idx) {
      var target_idx = 0;
      for (var i = 0; i < this.column_list.length; i++) {
        if (idx === this.column_list[i].idx) {
          target_idx = i;
          break;
        }
      }
      console.log("target_idx = " + target_idx);
      this.column_list.splice(target_idx, 1);
    },
    //ダウンロードするSQLファイルを生成する
    generate_sql_file: function() {
      var sql_stmt = this.create_sql_stmt();
      let blob = new Blob([sql_stmt], { type: "text/sql" });
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "create_data.sql";
      link.click();
    },
    //テストデータを生成するSQLを生成
    create_sql_stmt: function() {
      var sql_stmts = [];
      var current_vals = {};
      var sql_str = "";
      var column_list = [];
      //現在値と残りの繰り返し回数を保存しておく
      this.column_list.forEach(element => {
        if (element.data_type !== "timestamp") {
          current_vals[element.column_name] = {
            current_val: { val: element.min, index: 0 },
            num_of_times: element.num_of_times
          };
        } else {
          let current_val = Date.parse(element.min.replace(/-/g, "/")) / 1000;
          current_vals[element.column_name] = {
            current_val: { val: current_val, index: 0 },
            num_of_times: element.num_of_times
          };
        }
        column_list.push(element.column_name);
      });

      var column_str = column_list.join(", ");

      for (var i = 0; i < this.output_num; i++) {
        let val_list = [];
        let line =
          "INSERT INTO " + this.table_name + "(" + column_str + ") VALUES (";
        this.column_list.forEach(el => {
          var str_val = this.convert_to_sql_val(
            current_vals[el.column_name]["current_val"]["val"],
            el.data_type
          );
          val_list.push(str_val);
          current_vals[el.column_name]["current_val"] = this.get_next_val(
            current_vals[el.column_name]["current_val"],
            el.data_type,
            el.gen_type,
            el.collection,
            el.min,
            el.max,
            Number(el.num_of_times),
            el.selection_items
          );
        });
        var val_str = val_list.join(", ");
        line += val_str;
        console.log(line);
        line += ");\n";
        sql_str += line;
      }
      return sql_str;
    },
    convert_to_sql_val: function(current_val, data_type) {
      if (data_type == "integer") {
        return String(current_val);
      } else if (data_type == "varchar") {
        if (Number.isInteger(current_val)) {
          return "'" + "test" + String(current_val) + "'";
        } else {
          return "'" + current_val + "'";
        }
      } else if (data_type == "boolean") {
        return "'" + String(current_val) + "'";
      } else if (data_type == "timestamp") {
        var d = new Date(current_val * 1000);
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
        var min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
        var sec = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
        return (
          "'" +
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hour +
          ":" +
          min +
          ":" +
          sec +
          "'"
        );
      } else if (data_type == "blob") {
      }
    },
    get_next_val: function(
      current_val,
      data_type,
      gen_type,
      collection,
      min,
      max,
      num_of_times,
      selection_items
    ) {
      if (collection == "select") {
        if (gen_type == "random") {
          //indexは使わない
          return {
            val: selection_items[Math.floor(Math.random() * (max - min)) + min],
            index: -1
          };
        } else if (gen_type == "incremental") {
          if (current_val["index"] + 1 == selection_items.length) {
            current_val["index"] = 0;
          } else {
            current_val["index"]++;
          }
          return {
            val: selection_items[current_val["index"]],
            index: current_val["index"]
          };
        }
      } else {
        if (data_type == "integer") {
          min = Number(min);
          max = Number(max);
          if (gen_type == "random") {
            console.log("aaa:" + Math.random());
            return {
              val: Math.floor(Math.random() * (max - min)) + min,
              index: -1
            };
          } else if (gen_type == "incremental") {
            return { val: Number(current_val["val"]), index: -1 };
          }
        } else if (data_type == "varchar") {
          min = Number(min);
          max = Number(max);
          if (gen_type == "random") {
            var l = Math.floor(Math.random() * (max - min)) + min;
            console.log("length: " + String(l));
            var c =
              "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var cl = c.length;
            var r = "";
            for (var i = 0; i < l; i++) {
              r += c[Math.floor(Math.random() * cl)];
            }
            return {
              val: r,
              index: -1
            };
          } else if (gen_type == "incremental") {
            return { val: Number(current_val["val"]) + 1, index: -1 };
          }
        } else if (data_type == "boolean") {
          if (gen_type == "random") {
            return { val: Math.random() < 0.5, index: -1 };
          } else if (gen_type == "incremental") {
            return { val: !current_val["val"], index: -1 };
          }
        } else if (data_type == "timestamp") {
          if (gen_type == "random") {
            var ts_min = Date.parse(min.replace(/-/g, "/")) / 1000;
            var ts_max = Date.parse(max.replace(/-/g, "/")) / 1000;
            return {
              val: Math.floor(Math.random() * (ts_max - ts_min)) + ts_min,
              index: -1
            };
          } else if (gen_type == "incremental") {
            return { val: current_val["val"] + 60, index: -1 };
          }
        } else if (data_type == "blob") {
          return "";
        } else {
          return "";
        }
      }
    },
    is_not_select: function(gen_type) {
      if (gen_type != "select") {
        return true;
      }
      return false;
    }
    /*validate_num_of_times: function(num_of_times) {
      return isNaN(num_of_times);
    },
    validate_min: function(data_type, min, max) {
      if (!isNaN(min)) {
        if (!isNaN(max)) {
          if (Number(min) < Number(max)) {
            return true;
          }
        }
      }
      return false;
    },
    validate_max: function(data_type, min, max) {
      if (!isNaN(max)) {
        if (!isNaN(min)) {
          if (Number(min) < Number(max)) {
            return true;
          }
        }
      }
      return false;
    },
    preview_output_data: function() {}*/
  },
  computed: {
    update_data_type: function() {
      this.column_list.forEach(element => {
        console.log("watch");
        if (element.data_type == "integer") {
          if (isNaN(element.min)) {
            element.min = 1;
          }
          if (isNaN(element.max)) {
            element.max = 100;
          }
        } else if (element.data_type == "varchar") {
          if (isNaN(element.min)) {
            element.min = 1;
          }
          if (isNaN(element.max)) {
            element.max = 100;
          }
        } else if (element.data_type == "timestamp") {
          console.log("timestamp");
          if (Date.parse(element.min, "yyyy/MM/dd HH:mm:ss")) {
            let d = new Date();
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            let day = d.getDate();
            let hour = "00";
            let min = "00";
            let sec = "00";
            element.min =
              year +
              "-" +
              month +
              "-" +
              day +
              " " +
              hour +
              ":" +
              min +
              ":" +
              sec;
          }
          if (Date.parse(element.max, "yyyy/MM/dd HH:mm:ss")) {
            let d = new Date(element.min);
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            let day = d.getDate();
            let hour = "00";
            let min = "00";
            let sec = "00";
            element.max =
              year +
              "-" +
              month +
              "-" +
              day +
              " " +
              hour +
              ":" +
              min +
              ":" +
              sec;
          }
        }
      });
    },
    update_collection: function() {}
  },
  to_timestamp: function(unix_time) {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
