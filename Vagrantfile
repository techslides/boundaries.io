# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  APP_DIR = '/opt/boundaries.io'.freeze

  # https://docs.vagrantup.com.
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: 8080, host: 8080, auto_correct: true

  config.vm.network "private_network", ip: "192.168.33.10"

  # config.vm.network "public_network"

  config.vm.synced_folder ".", APP_DIR, create: true

  config.vm.provider "virtualbox" do |vb|
    vb.cpus = "2"
    vb.memory = "2048"
  end

  # keys and apt repos
  config.vm.provision 'shell', inline: <<-SHELL
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
    apt-add-repository 'deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.0 multiverse'
    apt-key adv --keyserver keyserver.ubuntu.com --recv 68576280
    apt-add-repository 'deb https://deb.nodesource.com/node_4.x precise main'
    add-apt-repository ppa:ubuntugis/ubuntugis-unstable
    apt-get update
  SHELL

  # packages
  config.vm.provision 'shell', inline: <<-SHELL
    apt-get install -y \
      nginx \
      nodejs \
      mongodb-org=3.0.4 \
      mongodb-org-server=3.0.4 \
      mongodb-org-shell=3.0.4 \
      mongodb-org-mongos=3.0.4 \
      mongodb-org-tools=3.0.4 \
      gdal-bin \
      jq
  SHELL

  # configs
  config.vm.provision 'file', {
    source: './provisioner/nginx.conf',
    destination: '/tmp/nginx.conf.example'
  }

  config.vm.provision 'shell', inline: 'mv /tmp/nginx.conf.example /etc/nginx/nginx.conf'

  # services
  config.vm.provision 'shell', inline: <<-SHELL
    service mongod restart
    service nginx restart
  SHELL

  # dependencies
  config.vm.provision 'shell', inline: "cd #{APP_DIR} && npm install"

  # bash profile
  config.vm.provision 'shell', inline: "echo 'cd #{APP_DIR}' | tee /home/vagrant/.bashrc"

end
