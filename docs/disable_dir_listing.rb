require "webrick"

module WEBrick
  module HTTPServlet
    class FileHandler
      alias original_initialize initialize

      def initialize(server, local_path, options = {})
        options = options.merge(FancyIndexing: false)
        original_initialize(server, local_path, options)
      end
    end
  end
end
