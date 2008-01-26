# Greasemaker Rakefile
#
# A build script for GreaseMonkey user scripts, based on the build scripts
# used by Prototype.


require 'rake'
require 'rake/packagetask'

SCRIPT_ROOT     = File.expand_path(File.dirname(__FILE__))
SCRIPT_SRC_DIR  = File.join(SCRIPT_ROOT, 'src')
SCRIPT_DIST_DIR = File.join(SCRIPT_ROOT, 'dist')
SCRIPT_PKG_DIR  = File.join(SCRIPT_ROOT, 'pkg')
SCRIPT_VERSION  = 'zipped'

task :default => [:dist, :package, :clean_package_source]

task :dist do
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

Rake::PackageTask.new('dude', SCRIPT_VERSION) do |package|
  package.need_tar_gz = true
  package.package_dir = SCRIPT_PKG_DIR
  package.package_files.include(
    '[A-Z]*',
    'dist/*.user.js',
    'lib/**',
    'src/**',
    'test/**'
  )
end

task :clean_package_source do
  rm_rf File.join(SCRIPT_PKG_DIR, "dude-#{SCRIPT_VERSION}")
end
