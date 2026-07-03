module.exports = {
  run: [
    {
      when: "{{exists('env')}}",
      method: "fs.rm",
      params: {
        path: "env"
      }
    },
    {
      when: "{{exists('app/env')}}",
      method: "fs.rm",
      params: {
        path: "app/env"
      }
    }
  ]
}
