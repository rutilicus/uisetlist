import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.run.BootRun

import kotlin.io.println

plugins {
	id("org.springframework.boot") version "2.2.2.RELEASE"
	id("io.spring.dependency-management") version "1.0.8.RELEASE"
	id("com.github.node-gradle.node") version "2.2.3"
	kotlin("jvm") version "1.3.61"
	kotlin("plugin.spring") version "1.3.61"
}

group = "com.rutilicus"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_1_8

repositories {
	mavenCentral()
}

node {
	version = "15.5.0"
	download = true
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	testImplementation("org.springframework.boot:spring-boot-starter-test") {
		exclude(group = "org.junit.vintage", module = "junit-vintage-engine")
	}
	implementation("org.postgresql:postgresql")
	implementation("org.springframework.boot:spring-boot-starter-security")
}

tasks {
	register("cleanAutoGen") {
		doFirst {
			println("foo1")
		}
		delete(fileTree("src/main/resources/static/js").matching {
			include("**/*.js")
		})
		doLast {
			println("foo2")
		}
	}
	register("babel") {
		doFirst {
			println("bar1")
		}
		dependsOn("npm_run_babel", "cleanAutoGen")
		mustRunAfter("cleanAutoGen")
		doLast {
			println("bar2")
		}
	}
	named<BootRun>("bootRun") {
		doFirst {
			println("hoge1")
		}
		dependsOn("babel")
		mustRunAfter("babel")
		sourceResources(sourceSets["main"])
		doLast {
			println("hoge2")
		}
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "1.8"
	}
}
