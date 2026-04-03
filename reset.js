module.exports = {
  run: [
    {
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
