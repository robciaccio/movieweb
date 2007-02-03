require 'rake'
require 'rake/packagetask'

PROTOTYPE_ROOT     = File.expand_path(File.dirname(__FILE__))
PROTOTYPE_SRC_DIR  = File.join(PROTOTYPE_ROOT, 'src')
PROTOTYPE_DIST_DIR = File.join(PROTOTYPE_ROOT, 'dist')
PROTOTYPE_PKG_DIR  = File.join(PROTOTYPE_ROOT, 'pkg')
PROTOTYPE_VERSION  = '1.6'

task :default => [:dist, :package, :clean_package_source]

task :dist do
  $:.unshift File.join(PROTOTYPE_ROOT, 'lib')
  require 'dudemaker'
  
  Dir.chdir(PROTOTYPE_SRC_DIR) do
    ['moviedude', 'gamedude'].each { |script|
      File.open(File.join(PROTOTYPE_DIST_DIR, script + '.user.js'), 'w+') do |dist|
        dist << Dudemaker::Preprocessor.new(script + '.js')
      end
    }
  end
end

Rake::PackageTask.new('dude', PROTOTYPE_VERSION) do |package|
  package.need_tar_gz = true
  package.package_dir = PROTOTYPE_PKG_DIR
  package.package_files.include(
    '[A-Z]*',
    'dist/*.user.js',
    'lib/**',
    'src/**',
    'test/**'
  )
end

task :clean_package_source do
  rm_rf File.join(PROTOTYPE_PKG_DIR, "dude-#{PROTOTYPE_VERSION}")
end
