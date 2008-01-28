# Greasemaker Rakefile
#
# A build script for GreaseMonkey user scripts, based on the build scripts
# used by Prototype.

require 'rake'

SCRIPT_ROOT     = File.expand_path(File.dirname(__FILE__))
SCRIPT_SRC_DIR  = File.join(SCRIPT_ROOT, 'src')
SCRIPT_DIST_DIR = File.join(SCRIPT_ROOT, 'dist')

task :default => [:compile]

task :compile do
  $:.unshift File.join(SCRIPT_ROOT, 'lib')
  require 'greasemaker'
  
  Dir.chdir(SCRIPT_SRC_DIR) do
    ['moviedude', 'gamedude'].each { |script|
      File.open(File.join(SCRIPT_DIST_DIR, script + '.user.js'), 'w+') do |dist|
        dist << GreaseMaker::Preprocessor.new(script + '.js')
      end
    }
  end
end
